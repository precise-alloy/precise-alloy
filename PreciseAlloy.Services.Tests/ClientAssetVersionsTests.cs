using System.Text.Encodings.Web;
using System.Text.Json;
using PreciseAlloy.Utils;

namespace PreciseAlloy.Services.Tests;

public class ClientAssetVersionsTests
{
    [Fact]
    public void RendersOnlyVersionedStylesAndScriptsUnderTheirExactPaths()
    {
        var json = RenderScriptData(new Dictionary<string, string>
        {
            ["/assets/css/blocks/Avatar.css"] = "style-v1",
            ["/assets/js/Header.js"] = "script-v2",
            ["/assets/js/header.0x1234.js"] = "",
            ["/assets/css/unversioned.css"] = " ",
            ["/assets/vendors/theme.css"] = "vendor",
            ["/assets/images/icon.svg"] = "image",
            ["/assets/css/script.js"] = "wrong-directory",
            ["/assets/js/app.js.map"] = "map",
            ["/assets/css/old.css?also=.css"] = "query",
            ["assets/js/relative.js"] = "relative",
            ["https://example.org/assets/js/app.js"] = "external"
        });

        using var document = JsonDocument.Parse(json);
        var versions = document.RootElement;
        Assert.Equal(2, versions.EnumerateObject().Count());
        Assert.Equal("style-v1", versions.GetProperty("/assets/css/blocks/Avatar.css").GetString());
        Assert.Equal("script-v2", versions.GetProperty("/assets/js/Header.js").GetString());
    }

    [Fact]
    public void EscapesKeysAndValuesWithoutChangingTheirJsonValues()
    {
        const string path = "/assets/css/</ScRiPt>.css";
        const string version = "</script><tag>&\"";
        var json = RenderScriptData(new Dictionary<string, string> { [path] = version });

        Assert.DoesNotContain("<", json);
        using var document = JsonDocument.Parse(json);
        Assert.Equal(version, document.RootElement.GetProperty(path).GetString());
    }

    [Fact]
    public void RendersEmptyObjectForEmptyManifest()
    {
        Assert.Equal("{}", RenderScriptData(new Dictionary<string, string>()));
    }

    private static string RenderScriptData(Dictionary<string, string> manifest)
    {
        using var writer = new StringWriter();
        ClientAssetVersions.Render(manifest).WriteTo(writer, HtmlEncoder.Default);
        var html = writer.ToString();

        const string open = "<script id=\"alveo-asset-versions\" type=\"application/json\">";
        const string close = "</script>";
        Assert.StartsWith(open, html);
        Assert.EndsWith(close, html);
        return html[open.Length..^close.Length];
    }
}
