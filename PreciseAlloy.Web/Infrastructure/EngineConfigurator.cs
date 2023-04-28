using Baaijte.Optimizely.ImageSharp.Web.Caching;
using SixLabors.ImageSharp.Web.Caching.Azure;
using SixLabors.ImageSharp.Web.DependencyInjection;
using SixLabors.ImageSharp.Web.Providers;
using SixLabors.ImageSharp.Web.Providers.Azure;

namespace PreciseAlloy.Web.Infrastructure;

internal static class EngineConfigurator
{
    private const int FarFutureExpirationDays = 365;
    private static readonly TimeSpan FarFutureExpiration = TimeSpan.FromDays(FarFutureExpirationDays);

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