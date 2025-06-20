using EPiServer.Core;
using EPiServer.Filters;
using EPiServer.Framework.Web;
using EPiServer.Web.Routing;
using EPiServer.Web;
using EPiServer;
using EPiServer.ServiceLocation;

namespace PreciseAlloy.Utils.Extensions;

public static class ContentExtensions
{
    private static IContentRepository ContentRepository => ServiceLocator.Current.GetInstance<IContentRepository>();
    private static IUrlResolver UrlResolver => ServiceLocator.Current.GetInstance<IUrlResolver>();

    /// <summary>
    /// Goes up the property stack to get the owning content
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="content">The content.</param>
    /// <returns>T.</returns>
    public static T? GetOwning<T>(
        this IContent content)
        where T : class, IContent
    {
        var parentRef = content.ParentLink;
        var parentGuid = Guid.Empty;

        while (!ContentReference.IsNullOrEmpty(parentRef) || parentGuid != Guid.Empty)
        {
            var parent = parentGuid != Guid.Empty
                ? ContentRepository.Get<IContent>(parentGuid)
                : ContentRepository.Get<IContent>(parentRef);

            if (parent == null)
            {
                break;
            }

            switch (parent)
            {
                case T t:
                    return t;

                case ContentAssetFolder contentAssetFolder:
                    parentRef = null;
                    parentGuid = contentAssetFolder.ContentOwnerID;
                    break;

                default:
                    parentRef = parent.ParentLink;
                    parentGuid = Guid.Empty;
                    break;
            }
        }

        return null;
    }

    public static string ToFriendlyUrl(
        this ContentReference contentReference,
        string? language = null)
    {
        string? text = null;
        if (!ContentReference.IsNullOrEmpty(contentReference))
        {
            text = !string.IsNullOrWhiteSpace(language)
                ? UrlResolver.GetUrl(contentReference, language)
                : UrlResolver.GetUrl(contentReference);
        }

        return text
               ?? string.Empty;
    }

    public static string ToExternalFriendlyUrl(
        this ContentReference contentReference,
        string? language = null)
    {
        if (ContentReference.IsNullOrEmpty(contentReference))
        {
            return string.Empty;
        }

        var siteDefinition = new Lazy<SiteDefinition>(() => ServiceLocator.Current
            .GetInstance<ISiteDefinitionResolver>()
            .GetByContent(
                contentReference,
                fallbackToWildcard: false,
                fallbackToEmpty: false));

        return contentReference
            .ToFriendlyUrl(language)
            .ToUri()
            .ToHostSpecificUri(siteDefinition, language);
    }

    public static IEnumerable<T>? FilterForDisplay<T>(
        this IEnumerable<T>? contents,
        FilterTemplate filterTemplate,
        bool requirePageTemplate = false,
        bool requireVisibleInMenu = false)
        where T : IContent
    {
        if (contents == null)
        {
            return null;
        }

        FilterAccess accessFilter = new();
        FilterPublished publishedFilter = new();
        contents = contents.Where(x => !publishedFilter.ShouldFilter(x)
                                       && !accessFilter.ShouldFilter(x));

        if (requirePageTemplate)
        {
            filterTemplate.TemplateTypeCategories = TemplateTypeCategories.Request;
            contents = contents.Where(x => !filterTemplate.ShouldFilter(x));
        }

        if (requireVisibleInMenu)
        {
            contents = contents.Where((x) => x.VisibleInMenu());
        }

        return contents;
    }

    public static bool VisibleInMenu(this IContent content)
    {
        return (content as PageData)?.VisibleInMenu ?? true;
    }
}
