using EPiServer.Web.Routing;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using PreciseAlloy.Models.Constants;

namespace PreciseAlloy.Utils.Extensions;

public static class HttpContextExtensions
{
    public static string GetLayoutType(
        this HttpContext context)
    {
        ArgumentNullException.ThrowIfNull(context);

        if (context.Items.TryGetValue(
                LayoutTypes.LayoutTypeKey,
                out object? layoutType)
            && layoutType is string s)
        {
            return s;
        }

        return string.Empty;
    }

    public static void SetLayoutType(
        this HttpContext context,
        string layoutType)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(layoutType);

        context.Items[LayoutTypes.LayoutTypeKey] = layoutType;
    }

    /// <summary>
    ///     Get language from request route data and throws an exception if language is missing.
    /// </summary>
    public static string GetLanguage(
        this HttpContext context,
        string fallback = "Unknown")
    {
        string? language = context.GetRequestedLanguage();

        return string.IsNullOrWhiteSpace(language)
            ? fallback
            : language;
    }

    /// <summary>
    ///     Get country name from Cloudflare CDN via request.
    /// </summary>
    /// <returns>ISO 3166-1 alpha-2 two-letter country codes if found, otherwise return AU as fallback</returns>
    public static string? GetCountry(
        this HttpContext context,
        string fallback = "AU")
    {
        StringValues? userOriginCountry = context?.Request.Headers["CF-IPCountry"];

        if (userOriginCountry is null
            || string.IsNullOrWhiteSpace(userOriginCountry))
        {
            return fallback;
        }

        return userOriginCountry;
    }
}