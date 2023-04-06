using EPiServer;
using EPiServer.Core;
using EPiServer.Filters;

namespace PreciseAlloy.Utils.Extensions;

public static class ContentRepositoryExtensions
{
    private static readonly FilterPublished FilterPublishedInstance = new();

    public static IEnumerable<T> ContentAreaItems<T>(
        this IContentRepository contentRepository,
        ContentArea contentArea)
        where T : class, IContentData
    {
        var items = contentArea
            ?.FilteredItems
            ?.Select(x => contentRepository.GetPublishedOrNull<T>(x.ContentLink));

        if (items == null)
        {
            yield break;
        }

        foreach (var item in items)
        {
            if (item != null)
            {
                yield return item;
            }
        }
    }

    public static T? GetPublishedOrNull<T>(
        this IContentRepository contentRepository,
        ContentReference contentReference)
        where T : class, IContentData
    {
        if (ContentReference.IsNullOrEmpty(contentReference)
            || !contentRepository.TryGet(new ContentReference(contentReference.ID), out T result)
            || result is not IContent content)
        {
            return null;
        }

        return FilterPublishedInstance.ShouldFilter(content)
            ? null
            : result;

    }

    public static IEnumerable<T> FilterPublished<T>(
        this IEnumerable<T> items)
        where T : IContent
    {
        return items
            .Where(x => !FilterPublishedInstance.ShouldFilter(x));
    }
}
