using EPiServer.Core;
using EPiServer.ServiceLocation;
using EPiServer.Web.Routing;

namespace PreciseAlloy.Utils.Extensions;
public static class ContentReferenceExtensions
{
    private static Injected<UrlResolver>? _urlResolver;

    public static string? GetUrl(this ContentReference contentReference, string? language = null)
    {
        return string.IsNullOrWhiteSpace(language) ? _urlResolver?.Service.GetUrl(contentReference) : _urlResolver?.Service.GetUrl(contentReference, language);
    }
}
