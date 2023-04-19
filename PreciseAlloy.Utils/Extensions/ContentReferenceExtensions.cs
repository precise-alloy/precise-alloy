using EPiServer.Core;
using EPiServer.Web.Routing;

namespace PreciseAlloy.Utils.Extensions;
public static class ContentReferenceExtensions
{
    private static readonly Lazy<UrlResolver>? UrlResolver;

    public static string? GetUrl(this ContentReference contentReference)
    {
        return UrlResolver?.Value.GetUrl(contentReference);
    }
}
