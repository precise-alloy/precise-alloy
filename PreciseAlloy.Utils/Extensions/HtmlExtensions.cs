using System.Collections.Concurrent;
using EPiServer.Framework.Web.Resources;
using EPiServer.ServiceLocation;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace PreciseAlloy.Utils.Extensions;

// ReSharper disable once UnusedMember.Global
public static class HtmlExtensions
{
    private static Injected<IWebHostEnvironment> HostingEnvironment { get; }
    private static Injected<ILogger> Logger { get; }
    private static readonly IDictionary<string, string> CacheBusterValues;

    private static readonly JsonSerializerSettings JsonSerializerSettings = new()
    {
        ContractResolver = new CamelCasePropertyNamesContractResolver(),
        NullValueHandling = NullValueHandling.Ignore
    };

    static HtmlExtensions()
    {
        try
        {
            var webRootPath = HostingEnvironment.Service.WebRootPath;
            var hashesPath = Path.Combine(webRootPath, "assets", "hashes.json");

            if (!File.Exists(hashesPath))
            {
                return;
            }

            var hashes = File.ReadAllText(hashesPath);
            var cacheBusterValues = JsonConvert.DeserializeObject<Dictionary<string, string>>(hashes);
            if (cacheBusterValues != null)
            {
                CacheBusterValues = cacheBusterValues;
            }

        }
        catch (Exception ex)
        {
            Logger.Service.LogError(ex, "Error when try get static hashes");
        }
        finally
        {
            CacheBusterValues ??= new ConcurrentDictionary<string, string>();
        }
    }

    public static string GetCacheBusterPath(string path)
    {
        return path + GetCacheBusterValue(path);
    }

    public static string GetCacheBusterPath(this IHtmlHelper htmlHelper, string path)
    {
        return GetCacheBusterPath(path);
    }

    private static string GetCacheBusterValue(string resourcePath)
    {
        if (string.IsNullOrWhiteSpace(resourcePath))
        {
            return "";
        }

        resourcePath = resourcePath.Trim();
        if (resourcePath.StartsWith("http", StringComparison.OrdinalIgnoreCase)
            || resourcePath.IndexOf("/assets/vendors/", StringComparison.OrdinalIgnoreCase) >= 0)
        {
            return "";
        }

        if (CacheBusterValues.TryGetValue(resourcePath.ToLowerInvariant(), out var cacheVersion))
        {
            return "?v=" + cacheVersion;
        }

        return "";
    }

    public static string GetWidgetAssetPath(string name)
    {
        return CacheBusterValues.Keys.FirstOrDefault(k => k.Contains($"/{name}.0x", StringComparison.OrdinalIgnoreCase)) ?? "";
    }

    public static string GetWidgetAssetPath(this IHtmlHelper htmlHelper, string name)
    {
        return GetWidgetAssetPath(name);
    }

    public static ClientResourceSettings RequireStyle(this IHtmlHelper htmlHelper, string path)
    {
        var cacheBusterPath = GetCacheBusterPath(path);
        return ClientResources.RequireStyle(cacheBusterPath, path, null);
    }

    public static ClientResourceSettings RequireScript(
        this IHtmlHelper htmlHelper,
        string path,
        bool module = true,
        bool? defer = null,
        bool? async = null)
    {
        var cacheBusterPath = GetCacheBusterPath(path);

        var attributes = new Dictionary<string, string>();

        if (module)
        {
            attributes["type"] = "module";
        }

        if (!module && defer == true)
        {
            attributes["defer"] = "";
        }

        if (async == true)
        {
            if (attributes.ContainsKey("defer"))
            {
                attributes.Remove("defer");
            }
            attributes["async"] = "";
        }

        return ClientResources.RequireScript(cacheBusterPath, path, null, attributes);
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
                ["type"]="application/json"
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
