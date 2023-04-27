using Baaijte.Optimizely.ImageSharp.Web.Caching;
using Microsoft.AspNetCore.Mvc.Razor;
using SixLabors.ImageSharp.Web.Caching.Azure;
using SixLabors.ImageSharp.Web.DependencyInjection;
using SixLabors.ImageSharp.Web.Providers;
using SixLabors.ImageSharp.Web.Providers.Azure;

namespace PreciseAlloy.Web.Infrastructure;

internal static class EngineConfigurator
{
    private const int FarFutureExpirationDays = 365;
    private static readonly TimeSpan FarFutureExpiration = TimeSpan.FromDays(FarFutureExpirationDays);
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

    public static IServiceCollection ConfigureImageResizing(
        this IServiceCollection services,
        IConfiguration configuration,
        IWebHostEnvironment webHostingEnvironment)
    {
        var builder = services.AddImageSharp(x =>
        {
            x.BrowserMaxAge = FarFutureExpiration;
        });

        if (webHostingEnvironment.IsDevelopment())
        {
            builder.Configure<BlobImageCacheOptions>(options =>
                {
                    var cacheFolder = configuration["Images:ResizedCacheDirectory"];
                    if (string.IsNullOrEmpty(cacheFolder))
                    {
                        cacheFolder = AppDomain.CurrentDomain.GetData("DataDirectory")?.ToString() 
                            ?? Path.Combine(webHostingEnvironment.ContentRootPath, "App_Data");
                        cacheFolder = Path.Combine(cacheFolder, "ImageCached");
                    }

                    options.CacheFolder = cacheFolder;

                })
                .ClearProviders()
                .AddProvider<CdnSupportBlobImageProvider>()
                .AddProvider<PhysicalFileSystemProvider>()
                .SetCache<BlobImageCache>();
        }
        else
        {
            builder.Configure<AzureBlobStorageCacheOptions>(options =>
                {
                    options.ConnectionString = configuration.GetConnectionString("EPiServerAzureBlobs");
                    options.ContainerName = "mysitemedia";
                })
                .ClearProviders()
                .AddProvider<AzureBlobStorageImageProvider>()
                .SetCache<AzureBlobStorageCache>();
        }
        return services;
    }
}