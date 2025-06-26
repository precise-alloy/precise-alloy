using System.Globalization;
using EPiServer;
using EPiServer.Globalization;
using EPiServer.ServiceLocation;
using EPiServer.Web;
using EPiServer.Web.Routing;

namespace PreciseAlloy.Utils.Extensions;

public static class UrlExtensions
{
    public static Uri? ToUri(this string uri)
    {
        Uri.TryCreate(uri, UriKind.RelativeOrAbsolute, out var result);
        return result;
    }

    public static string ToHostSpecificUri(
        this Uri? relativeUri,
        Lazy<SiteDefinition>? siteDefinition = null,
        string? language = null)
    {
        var text = relativeUri?.ToString();
        if (relativeUri != null && !relativeUri.IsAbsoluteUri)
        {
            CultureInfo? culture = null;

            try
            {
                if (!string.IsNullOrEmpty(language))
                {
                    culture = CultureInfo.GetCultureInfo(language);
                }
            }
            catch
            {
                // ignored
            }


            if (string.IsNullOrWhiteSpace(language) || culture is null)
            {
                culture = ContentLanguage.PreferredCulture;
            }

            var siteDefinition2 = siteDefinition?.Value ?? SiteDefinition.Current;
            var primaryHost = siteDefinition2.GetPrimaryHost(culture);
            if (primaryHost == null
                || !Uri.TryCreate(siteDefinition2.SiteUrl.Scheme + "://" + primaryHost.Name, UriKind.Absolute, out var result))
            {
                result = siteDefinition2.SiteUrl;
            }

            text = result + text?.TrimStart('/');
        }

        return text ?? string.Empty;
    }

    public static string ToExternalFriendlyUrl(
        this Url internalUrl,
        string? language = null)
    {
        string? text = null;
        if (!internalUrl.IsEmpty())
        {
            text = internalUrl.ToFriendlyUrl().ToUri().ToHostSpecificUri(null, language);
        }

        return text ?? string.Empty;
    }

    public static string ToFriendlyUrl(
        this Url internalUrl)
    {
        if (internalUrl.IsEmpty())
        {
            return string.Empty;
        }

        var urlBuilderWithInternalUrl = new UrlBuilder(internalUrl);
        return ServiceLocator.Current.GetInstance<IUrlResolver>()
                   .GetUrl(urlBuilderWithInternalUrl, ContextMode.Default)
               ?? string.Empty;
    }

    public static string ToFriendlyUrl(this string link)
    {
        var internalUrl = new Url(link);
        return ToFriendlyUrl(internalUrl);
    }
}