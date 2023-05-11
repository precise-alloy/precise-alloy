using EPiServer.Cms.Shell.Search;
using EPiServer.Framework.Localization;
using EPiServer.ServiceLocation;
using EPiServer.Shell;
using EPiServer.Shell.Search;
using EPiServer.Web;
using EPiServer.Web.Routing;
using PreciseAlloy.Models.Settings;
using PreciseAlloy.Services.Settings;

namespace PreciseAlloy.Web.Settings;

[SearchProvider]
public class GlobalSettingsSearchProvider
    : ContentSearchProviderBase<SettingsBase, ContentType>
{
    internal const string SearchArea = "Settings/globalsettings";
    private readonly IContentLoader _contentLoader;
    private readonly LocalizationService _localizationService;
    private readonly ISettingsService _settingsService;

    public GlobalSettingsSearchProvider(
        LocalizationService localizationService,
        ISiteDefinitionResolver siteDefinitionResolver,
        IContentTypeRepository<ContentType> contentTypeRepository,
        EditUrlResolver editUrlResolver,
        ServiceAccessor<SiteDefinition> currentSiteDefinition,
        IContentLanguageAccessor contentLanguageAccessor,
        IUrlResolver urlResolver,
        ITemplateResolver templateResolver,
        UIDescriptorRegistry uiDescriptorRegistry,
        IContentLoader contentLoader,
        ISettingsService settingsService)
        : base(
            localizationService: localizationService,
            siteDefinitionResolver: siteDefinitionResolver,
            contentTypeRepository: contentTypeRepository,
            editUrlResolver: editUrlResolver,
            currentSiteDefinition: currentSiteDefinition,
            languageResolver: contentLanguageAccessor,
            urlResolver: urlResolver,
            templateResolver: templateResolver,
            uiDescriptorRegistry: uiDescriptorRegistry)
    {
        _contentLoader = contentLoader;
        _settingsService = settingsService;
        _localizationService = localizationService;
    }

    public override string Area => SearchArea;

    public override string Category => _localizationService.GetString("/episerver/cms/components/globalSettings/title", "Site Settings");

    protected override string IconCssClass => "epi-iconSettings";

    public override IEnumerable<SearchResult> Search(Query query)
    {
        if (string.IsNullOrWhiteSpace(query.SearchQuery)
            || query.SearchQuery.Trim().Length < 2)
        {
            return Enumerable.Empty<SearchResult>();
        }

        var searchResultList = new List<SearchResult>();
        var str = query.SearchQuery.Trim();

        var globalSettings = _contentLoader
            .GetChildren<SettingsBase>(contentLink: _settingsService.GlobalSettingsRoot);

        foreach (var setting in globalSettings)
        {
            if (setting.Name.IndexOf(value: str, comparisonType: StringComparison.OrdinalIgnoreCase) < 0)
            {
                continue;
            }

            searchResultList.Add(CreateSearchResult(contentData: setting));

            if (searchResultList.Count == query.MaxResults)
            {
                break;
            }
        }

        return searchResultList;
    }

    protected override string CreatePreviewText(IContentData? content)
    {
        return content == null
            ? $"{(content as SettingsBase)?.Name} {_localizationService.GetString("/contentRepositories/globalsettings/customSelectTitle", "Settings").ToLower()}"
            : string.Empty;
    }

    protected override string GetEditUrl(
        SettingsBase? contentData,
        out bool onCurrentHost)
    {
        onCurrentHost = true;

        if (contentData == null)
        {
            return string.Empty;
        }

        var contentLink = contentData.ContentLink;
        var language = contentData.Language.Name;

        // ReSharper disable StringLiteralTypo
        return $"/episerver/PreciseAlloy.Cms.Settings/settings#context=epi.cms.contentdata:///{contentLink.ID}&viewsetting=viewlanguage:///{language}";
        // ReSharper restore StringLiteralTypo
    }
}
