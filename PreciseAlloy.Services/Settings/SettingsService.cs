using EPiServer;
using EPiServer.Cms.Shell;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAccess;
using EPiServer.Framework.Cache;
using EPiServer.Framework.TypeScanner;
using EPiServer.Globalization;
using EPiServer.Security;
using EPiServer.ServiceLocation;
using EPiServer.Web;
using EPiServer.Web.Routing;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using PreciseAlloy.Models.Settings;
using PreciseAlloy.Utils.Extensions;

namespace PreciseAlloy.Services.Settings;

public partial class SettingsService
    : ISettingsService
{
    public const string SettingServicesMasterCacheKey = "PreciseAlloy-SiteSettings";
    public const string LanguageSettingsCacheKey = "PreciseAlloy-SiteSettings-LanguageSettings";

    private readonly IContentEvents _contentEvents;
    private readonly IContentLanguageSettingsHandler _contentLanguageSettingsHandler;
    private readonly IContentRepository _contentRepository;
    private readonly IContentTypeRepository _contentTypeRepository;
    private readonly IContentVersionRepository _contentVersionRepository;
    private readonly IContextModeResolver _contextModeResolver;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<SettingsService> _logger;
    private readonly ISiteDefinitionEvents _siteDefinitionEvents;
    private readonly ISiteDefinitionRepository _siteDefinitionRepository;
    private readonly ISiteDefinitionResolver _siteDefinitionResolver;
    private readonly ISynchronizedObjectInstanceCache _cacheManager;
    private readonly ITypeScannerLookup _typeScannerLookup;
    private readonly ContentRootService _contentRootService;
    public ContentReference? GlobalSettingsRoot { get; set; }

    public SettingsService(
        IContentEvents contentEvents,
        IContentLanguageSettingsHandler contentLanguageSettingsHandler,
        IContentRepository contentRepository,
        IContentTypeRepository contentTypeRepository,
        IContentVersionRepository contentVersionRepository,
        IContextModeResolver contextModeResolver,
        IHttpContextAccessor httpContextAccessor,
        ILogger<SettingsService> logger,
        ISiteDefinitionEvents siteDefinitionEvents,
        ISiteDefinitionRepository siteDefinitionRepository,
        ISiteDefinitionResolver siteDefinitionResolver,
        ISynchronizedObjectInstanceCache cacheManager,
        ITypeScannerLookup typeScannerLookup,
        ContentRootService contentRootService)
    {
        _contentEvents = contentEvents;
        _contentLanguageSettingsHandler = contentLanguageSettingsHandler;
        _contentRepository = contentRepository;
        _contentTypeRepository = contentTypeRepository;
        _contentVersionRepository = contentVersionRepository;
        _contextModeResolver = contextModeResolver;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
        _siteDefinitionEvents = siteDefinitionEvents;
        _siteDefinitionRepository = siteDefinitionRepository;
        _siteDefinitionResolver = siteDefinitionResolver;
        _cacheManager = cacheManager;
        _typeScannerLookup = typeScannerLookup;
        _contentRootService = contentRootService;
        _logger.EnterConstructor();
        _logger.ExitConstructor();
    }

    public void InitializeSettings()
    {
        try
        {
            RegisterContentRoots();
        }
        catch (NotSupportedException notSupportedException)
        {
            _logger.LogError(notSupportedException, $"[Settings] {notSupportedException.Message}");
            throw;
        }

        ContentLanguageSettingRepository.ContentLanguageSettingDeleted += ContentLanguageSettingSavedOrDeleted;
        ContentLanguageSettingRepository.ContentLanguageSettingSaved += ContentLanguageSettingSavedOrDeleted;
        _contentEvents.PublishedContent += PublishedContent;
        _contentEvents.SavedContent += SavedContent;
        _contentEvents.MovedContent += MovedContent;
        _contentEvents.DeletedContentLanguage += DeletedContentLanguage;
        _siteDefinitionEvents.SiteCreated += SiteCreated;
        _siteDefinitionEvents.SiteUpdated += SiteUpdated;
        _siteDefinitionEvents.SiteDeleted += SiteDeleted;
    }

    public void UpdateSettings()
    {
        var root = _contentRepository.GetItems(
                _contentRootService.List(),
                new LoaderOptions())
            .FirstOrDefault(x => x.ContentGuid == SettingsFolder.SettingsRootGuid);

        if (root == null)
        {
            _logger.LogWarning("[Settings] Setting root is NULL");
            return;
        }

        GlobalSettingsRoot = root.ContentLink;
        var children = _contentRepository.GetChildren<SettingsFolder>(GlobalSettingsRoot).ToList();
        foreach (var site in _siteDefinitionRepository.List())
        {
            var folder = children.Find(x => x.Name.Equals(site.Name, StringComparison.InvariantCultureIgnoreCase));
            if (folder != null)
            {
                var settingsTypes = new List<Type>();
                foreach (var child in _contentRepository.GetChildren<SettingsBase>(folder.ContentLink, new LoaderOptions { LanguageLoaderOption.MasterLanguage() }))
                {
                    var settingType = child.GetOriginalType();
                    if (settingsTypes.Contains(settingType))
                    {
                        _logger.LogWarning($"[Settings] Setting of type {settingType.Name} for site {folder.Name} have more than one instance");
                    }
                    else
                    {
                        settingsTypes.Add(settingType);
                    }
                    RepopulateCacheForAllLanguage(site.Id, child);
                }
            }
            else
            {
                CreateSiteFolder(site);
            }
        }
    }

    public T? GetSiteSettings<T>(
        Guid? siteId = null,
        string? language = null)
        where T : SettingsBase
    {
        var contentType = typeof(T);
        if (contentType.IsInterface)
        {
            var registerType = ServiceLocator.Current.GetInstance<T>();
            contentType = registerType.GetType();
        }
        var contentLanguage = language ?? ContentLanguage.PreferredCulture.Name;
        if (!siteId.HasValue)
        {
            siteId = ResolveSiteId();
            if (siteId == Guid.Empty)
            {
                return default;
            }
        }
        try
        {
            var settings = GetSettingFromCache(
                siteId.Value, contentType,
                _contextModeResolver.CurrentMode == ContextMode.Edit);

            if (settings.FirstOrDefault() is not { Value: { } } setting)
            {
                return default;
            }

            var languageIncludeFallback = GetFallbackLanguage(contentLanguage, setting.Value.ContentLink);
            languageIncludeFallback.Insert(0, contentLanguage);
            var matchedLanguage = languageIncludeFallback.FirstOrDefault(x => settings.ContainsKey(x)); //Get requesting language or fallback
            if (!string.IsNullOrEmpty(matchedLanguage))
            {
                return settings[matchedLanguage] as T;
            }

            return settings.Values.FirstOrDefault(x => x.IsMasterLanguageBranch()) as T;

        }
        catch (ArgumentNullException argumentNullException)
        {
            _logger.LogError(argumentNullException, $"[Settings] {argumentNullException.Message}");
        }

        return default;
    }

    private void RegisterContentRoots()
    {
        var registeredRoots = _contentRepository.GetItems(_contentRootService.List(), new LoaderOptions());
        var settingsRootRegistered = registeredRoots
            .Any(x => x.ContentGuid == SettingsFolder.SettingsRootGuid
                      && x.Name.Equals(SettingsFolder.SettingsRootName));

        if (!settingsRootRegistered)
        {
            _contentRootService.Register<SettingsFolder>(
                SettingsFolder.SettingsRootName,
                SettingsFolder.SettingsRootGuid,
                ContentReference.RootPage);
        }

        UpdateSettings();
    }

    private Dictionary<string, SettingsBase?> GetSettingFromCache(Guid siteId, Type type, bool isEditMod)
    {
        //If cache cleared
        if (_cacheManager.Get(CreateCacheKey(siteId, type, isEditMod)) is Dictionary<string, SettingsBase?>
            settingsOfType)
        {
            return settingsOfType;
        }

        if (!RepopulateCacheForAllLanguage(siteId, type))
        {
            InsertSettingToCache(siteId, type, false, new Dictionary<string, SettingsBase?>());
            InsertSettingToCache(siteId, type, true, new Dictionary<string, SettingsBase?>());
            _logger.LogWarning($"[Settings] no setting available for type {type} in site {siteId}");
        }

        return _cacheManager.Get(CreateCacheKey(siteId, type, isEditMod)) as Dictionary<string, SettingsBase?>
               ?? new Dictionary<string, SettingsBase?>();

    }

    private bool RepopulateCacheForAllLanguage(Guid siteId, Type type)
    {
        var root = _contentRepository.GetItems(_contentRootService.List(), new LoaderOptions())
            .FirstOrDefault(x => x.ContentGuid == SettingsFolder.SettingsRootGuid)
                   ?? _contentRepository.Get<IContent>(SettingsFolder.SettingsRootGuid);
        if (root == null)
        {
            _logger.LogWarning("[Settings] Setting root is NULL");
            return false;
        }

        var site = _siteDefinitionRepository.Get(siteId);
        if (site == null)
        {
            return false;
        }

        var folder = _contentRepository
            .GetChildren<SettingsFolder>(root.ContentLink)
            .FirstOrDefault(x => x.Name.Equals(site.Name, StringComparison.InvariantCultureIgnoreCase));

        if (folder == null)
        {
            return false;
        }

        var settings = _contentRepository.GetChildren<SettingsBase>(
                folder.ContentLink,
                new LoaderOptions { LanguageLoaderOption.MasterLanguage() })
            .FirstOrDefault(x => type == x.GetOriginalType());

        if (settings == null)
        {
            return false;
        }
        else
        {
            RepopulateCacheForAllLanguage(siteId, settings);
        }
        return true;
    }

    // ReSharper disable once SuggestBaseTypeForParameter
    private void RepopulateCacheForAllLanguage(Guid siteId, SettingsBase settings)
    {
        var publishedSettings = new Dictionary<string, SettingsBase?>();
        var draftSettings = new Dictionary<string, SettingsBase?>();
        foreach (var lang in settings.ExistingLanguages)
        {
            var setting = _contentRepository
                .Get<SettingsBase>(
                    settings.ContentLink.ToReferenceWithoutVersion(),
                    new LoaderOptions { LanguageLoaderOption.FallbackWithMaster(lang) });
            publishedSettings[lang.Name] = setting;
            draftSettings[lang.Name] = setting;

            // add draft (not published version) settings
            var draftContentLink = _contentVersionRepository.LoadCommonDraft(settings.ContentLink, lang.Name);
            if (draftContentLink != null)
            {
                var settingsDraft = _contentRepository.Get<SettingsBase>(draftContentLink.ContentLink);
                draftSettings[lang.Name] = settingsDraft;
            }
        }

        InsertSettingToCache(siteId, settings.GetOriginalType(), false, publishedSettings);
        InsertSettingToCache(siteId, settings.GetOriginalType(), true, draftSettings);
    }

    private void InsertSettingToCache(
        Guid siteId,
        Type type,
        bool isEditMode,
        Dictionary<string, SettingsBase?> settingOfType)
    {
        _cacheManager.Insert(
            CreateCacheKey(siteId, type, isEditMode),
            settingOfType,
            new CacheEvictionPolicy(
                TimeSpan.FromDays(30),
                CacheTimeoutType.Absolute,
                Enumerable.Empty<string>(),
                new[] { SettingServicesMasterCacheKey }));
    }

    /// <remarks>Remove cache so ISynchronizedObjectInstanceCache will remove cache from all CDN server, cache</remarks>
    private void RemoveCache<T>(
        Guid siteId,
        T? settings)
        where T : SettingsBase
    {
        if (settings == null)
        {
            return;
        }
        var type = settings.GetOriginalType();
        _cacheManager.Remove(CreateCacheKey(siteId, type, true));
        _cacheManager.Remove(CreateCacheKey(siteId, type, false));
    }

    public void ClearCache()
    {
        _cacheManager.Remove(SettingServicesMasterCacheKey);
        _cacheManager.Remove(LanguageSettingsCacheKey);
    }

    private List<string> GetFallbackLanguage(string language, ContentReference settingsRef)
    {
        var cacheKey = CreateLanguageSettingsCacheKey(settingsRef);
        if (_cacheManager.Get(cacheKey) is not Dictionary<string, List<string>> languageSettings)
        {
            languageSettings = _contentLanguageSettingsHandler
                .Get(settingsRef)
                .Where(x => x.IsActive)
                .ToDictionary(
                    x => x.LanguageBranch,
                    x => x.LanguageBranchFallback.ToList());

            _cacheManager.Insert(
                cacheKey,
                languageSettings,
                new CacheEvictionPolicy(
                    TimeSpan.FromDays(30),
                    CacheTimeoutType.Absolute,
                    Enumerable.Empty<string>(),
                    new[]
                    {
                        LanguageSettingsCacheKey
                    }));
        }

        return languageSettings.TryGetValue(language, out var fallBacks)
            ? fallBacks.ToList() //Clone List<>
            : new List<string>();
    }

    private void CreateSiteFolder(SiteDefinition siteDefinition)
    {
        var folder = _contentRepository.GetDefault<SettingsFolder>(GlobalSettingsRoot);
        folder.Name = siteDefinition.Name;
        var reference = _contentRepository.Save(folder, SaveAction.Publish, AccessLevel.NoAccess);

        var settingsModelTypes = _typeScannerLookup
            .AllTypes
            .Where(t => t.GetCustomAttributes(typeof(SettingsContentTypeAttribute), false).Length > 0);

        foreach (var settingsType in settingsModelTypes)
        {
            if (!(settingsType.GetCustomAttributes(typeof(SettingsContentTypeAttribute), false)
                    .FirstOrDefault() is SettingsContentTypeAttribute attribute))
            {
                continue;
            }

            var contentType = _contentTypeRepository.Load(settingsType);

            var newSettings = _contentRepository.GetDefault<IContent>(reference, contentType.ID);
            newSettings.Name = attribute.DisplayName;
            _contentRepository.Save(newSettings, SaveAction.Publish, AccessLevel.NoAccess);

            InsertSettingToCache(
                siteDefinition.Id,
                newSettings.GetOriginalType(),
                false,
                new Dictionary<string, SettingsBase?>
                {
                    [newSettings.LanguageBranch()] = newSettings as SettingsBase
                });

            InsertSettingToCache(
                siteDefinition.Id,
                newSettings.GetOriginalType(),
                true,
                new Dictionary<string, SettingsBase?>
                {
                    [newSettings.LanguageBranch()] = newSettings as SettingsBase
                });
        }
    }

    private static string CreateCacheKey(Guid siteId, Type type, bool isEditMode)
    {
        return isEditMode
            ? $"{SettingServicesMasterCacheKey}-{siteId}-common-draft-{type.FullName}"
            : $"{SettingServicesMasterCacheKey}-{siteId}-{type.FullName}";
    }

    private static string CreateLanguageSettingsCacheKey(ContentReference settingsRef) => $"{LanguageSettingsCacheKey}-LanguageSettingsOf-{settingsRef.ID}";
}
