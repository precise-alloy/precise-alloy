using Microsoft.AspNetCore.Mvc.Razor;

namespace PreciseAlloy.Web.Infrastructure;

internal static class EngineConfigurator
{
    private static readonly string[] AdditionalViewLocationFormats =
    {
        "/Features/{1}/{0}.cshtml",
        "/Features/{0}.cshtml",
    };

    public static void ConfigureRazor(this RazorViewEngineOptions options)
    {
        var formats = options.ViewLocationFormats;
        foreach (var format in AdditionalViewLocationFormats)
        {
            formats.Insert(0, format);
        }
    }
}