using EPiServer.Framework.Web.Resources;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace PreciseAlloy.Utils.Extensions;

// ReSharper disable once UnusedMember.Global
public static class HtmlExtensions
{
    private static readonly JsonSerializerSettings JsonSerializerSettings = new()
    {
        ContractResolver = new CamelCasePropertyNamesContractResolver(),
        NullValueHandling = NullValueHandling.Ignore
    };

    /// <summary>
    /// Registers a stylesheet with EPiServer's client resource system.
    /// Pass an already cache-busted URL (e.g. <c>AssetPaths.BAlertCss</c>).
    /// </summary>
    public static ClientResourceSettings RequireStyle(this IHtmlHelper htmlHelper, string url)
    {
        return ClientResources.RequireStyle(url, url, null);
    }

    /// <summary>
    /// Registers a script with EPiServer's client resource system.
    /// Pass an already cache-busted URL (e.g. <c>AssetPaths.MainJs</c>).
    /// </summary>
    public static ClientResourceSettings RequireScript(
        this IHtmlHelper htmlHelper,
        string url,
        bool module = true,
        bool? defer = null,
        bool? async = null)
    {
        var attributes = new Dictionary<string, string>();

        if (module)
        {
            attributes["type"] = "module";
        }

        if (async == true)
        {
            attributes["async"] = "";
        }
        else if (!module && defer == true)
        {
            attributes["defer"] = "";
        }

        return ClientResources.RequireScript(url, url, null, attributes);
    }

    public static IHtmlContent ReactSection(
        this IHtmlHelper helper,
        object data,
        string reactType,
        string? reactClass = null,
        string? reactTag = null)
    {
        var resource = new ClientResource
        {
            ResourceType = ClientResourceType.Script,
            InlineContent = JsonConvert.SerializeObject(data, Formatting.Indented, JsonSerializerSettings),
            Attributes =
            {
                ["data-rct"] = reactType,
                ["type"] = "application/json"
            }
        };

        if (!string.IsNullOrWhiteSpace(reactClass))
        {
            resource.Attributes["data-class"] = reactClass;
        }

        if (!string.IsNullOrWhiteSpace(reactTag))
        {
            resource.Attributes["data-tag"] = reactTag;
        }

        return ClientResources.RenderResource(resource);
    }
}