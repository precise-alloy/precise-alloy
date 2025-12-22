using EPiServer.Authorization;
using Geta.NotFoundHandler.Infrastructure.Configuration;
using Geta.NotFoundHandler.Optimizely.Infrastructure.Configuration;
using Geta.Optimizely.Sitemaps;
using Stott.Optimizely.RobotsHandler.Configuration;

namespace PreciseAlloy.Web.Infrastructure.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddGetaSitemaps(
        this IServiceCollection services)
    {
        services.AddSitemaps(x =>
        {
            x.EnableRealtimeCaching = true;
            x.EnableRealtimeSitemap = false;
        }, p => p.RequireRole(Roles.WebAdmins));

        return services;
    }

    public static IServiceCollection AddGetaNotFoundHandler(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddNotFoundHandler(o =>
        {
            o.UseSqlServer(configuration.GetConnectionString("EPiServerDB"));
            o.BufferSize = 30;
            o.ThreshHold = 5;
            o.HandlerMode = FileNotFoundMode.On;
            o.IgnoredResourceExtensions = ["svg", "jpg", "gif", "png", "css", "js", "ico", "swf", "woff", "css", "js"];
            o.Logging = LoggerMode.Off;
            o.LogWithHostname = false;
        }, builder => { builder.RequireRole(Roles.WebAdmins); });

        services.AddOptimizelyNotFoundHandler(o => { o.AutomaticRedirectsEnabled = true; });
        services.AddRobotsHandler();

        return services;
    }
}