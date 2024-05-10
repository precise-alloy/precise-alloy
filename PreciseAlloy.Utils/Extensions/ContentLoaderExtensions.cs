using EPiServer;
using EPiServer.Core;
using EPiServer.Filters;

namespace PreciseAlloy.Utils.Extensions;

// ReSharper disable once UnusedMember.Global
public static class ContentLoaderExtensions
{
    private static readonly FilterPublished FilterPublishedInstance = new();

    // ReSharper disable once UnusedMember.Global
    public static T? GetPublishedOrNull<T>(
        this IContentLoader contentLoader,
        ContentReference contentReference)
        where T : class, IContentData
    {
        if (ContentReference.IsNullOrEmpty(contentReference)
            || !contentLoader.TryGet(new ContentReference(contentReference.ID), out T result))
        {
            return null;
        }

        // While there's no direct cast between IContentData and IContent,
        // we can be almost sure that will succeed at runtime as
        // EPiServer provides us with proxy class which implements IContent
        // The only known exception for now is Content Property of Block Type
        return result is not IContent content
               || FilterPublishedInstance.ShouldFilter(content)
            ? null
            : result;

    }
}
