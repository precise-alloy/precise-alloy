using EPiServer.Core;
using EPiServer.ServiceLocation;
using EPiServer.Web.Routing;

namespace PreciseAlloy.Utils.Extensions;
public static class ContentReferenceExtensions
{
    private static readonly Injected<UrlResolver> UrlResolver;

    public static string? GetUrl(
        this ContentReference contentReference,
        string? language = null)
    {
        return UrlResolver.Service.GetUrl(contentReference, language);
    }
}
