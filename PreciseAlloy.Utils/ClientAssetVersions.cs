using System.Text.Json;
using Microsoft.AspNetCore.Html;

namespace PreciseAlloy.Utils;

public static class ClientAssetVersions
{
    public static IHtmlContent Render(IDictionary<string, string> manifest)
    {
        var versions = manifest
            .Where(entry => !string.IsNullOrWhiteSpace(entry.Value) && IsClientAssetPath(entry.Key))
            .ToDictionary();

        // Script data is raw text: use System.Text.Json's HTML-safe default encoder,
        // not Razor HTML encoding (which would turn JSON quotes into literal entities).
        var json = JsonSerializer.Serialize(versions);
        return new HtmlString($"<script id=\"alveo-asset-versions\" type=\"application/json\">{json}</script>");
    }

    private static bool IsClientAssetPath(string path)
    {
        return path.IndexOfAny(['?', '#']) < 0
            && ((path.StartsWith("/assets/css/", StringComparison.Ordinal) && path.EndsWith(".css", StringComparison.Ordinal))
                || (path.StartsWith("/assets/js/", StringComparison.Ordinal) && path.EndsWith(".js", StringComparison.Ordinal)));
    }
}
