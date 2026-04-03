using EPiServer.Applications;
using EPiServer.Cms.Shell.Search;
using EPiServer.Framework.Localization;
using EPiServer.Shell;
using EPiServer.Shell.Search;
using EPiServer.Web.Routing;
using PreciseAlloy.Models.Settings;
using PreciseAlloy.Services.Settings;

namespace PreciseAlloy.Web.Settings;

[SearchProvider]
// ReSharper disable once ClassNeverInstantiated.Global
public class GlobalSettingsSearchProvider(
    LocalizationService localizationService,
    IApplicationResolver siteDefinitionResolver,
    IContentTypeRepository contentTypeRepository,
    EditUrlResolver editUrlResolver,
    IContentLanguageAccessor contentLanguageAccessor,
    IUrlResolver urlResolver,
    UIDescriptorRegistry uiDescriptorRegistry,
    IContentLoader contentLoader,
    ISettingsService settingsService)
    : ContentSearchProviderBase<SettingsBase, ContentType>(
        localizationService,
        siteDefinitionResolver,
        contentTypeRepository,
        editUrlResolver,
        contentLanguageAccessor,
        urlResolver,
        uiDescriptorRegistry)
{
    internal const string SearchArea = "Settings/globalsettings";

    public override string Area => SearchArea;

    public override string Category => LocalizationService.GetString("/episerver/cms/components/globalSettings/title", "Site Settings");

    protected override string IconCssClass => "epi-iconSettings";

    public override IEnumerable<SearchResult> Search(Query query)
    {
        if (string.IsNullOrWhiteSpace(query.SearchQuery)
            || query.SearchQuery.Trim().Length < 2)
        {
            return [];
        }

        var searchResultList = new List<SearchResult>();
        var str = query.SearchQuery.Trim();

        var globalSettings = contentLoader
            .GetChildren<SettingsBase>(settingsService.GlobalSettingsRoot);

        foreach (var setting in globalSettings)
        {
            if (setting.Name.IndexOf(str, StringComparison.OrdinalIgnoreCase) < 0)
            {
                continue;
            }

            searchResultList.Add(CreateSearchResult(setting));

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
            ? $"{(content as SettingsBase)?.Name} {LocalizationService.GetString("/contentRepositories/globalsettings/customSelectTitle", "Settings").ToLower()}"
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

        var language = contentData is ILocalizable localizable
            ? localizable.Language.Name
            : string.Empty;

        // ReSharper disable StringLiteralTypo
        return $"/episerver/PreciseAlloy.Cms.Settings/settings#context=epi.cms.contentdata:///{contentLink.ID}&viewsetting=viewlanguage:///{language}";
        // ReSharper restore StringLiteralTypo
    }
}