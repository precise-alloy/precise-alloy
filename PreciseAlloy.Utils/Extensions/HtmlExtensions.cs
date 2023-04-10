using System.Collections.Concurrent;
using EPiServer.Framework.Web.Resources;
using EPiServer.ServiceLocation;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace PreciseAlloy.Utils.Extensions;

// ReSharper disable once UnusedMember.Global
public static class HtmlExtensions
{
    private static Injected<IWebHostEnvironment> HostingEnvironment { get; }
    private static Injected<ILogger> Logger { get; }
    private static readonly IDictionary<string, string> CacheBusterValues;

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
        if (resourcePath.StartsWith("http", StringComparison.InvariantCultureIgnoreCase)
            || resourcePath.IndexOf("/assets/vendors/", StringComparison.InvariantCultureIgnoreCase) >= 0)
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
            attributes["async"] = "";
        }

        return ClientResources.RequireScript(cacheBusterPath, path, null, attributes);
    }
}
