using EPiServer.Authorization;

namespace PreciseAlloy.Web.Infrastructure.DependencyInjection;

public static class ServiceCollectionExtensions
{
    // TODO: Geta.Optimizely.Sitemaps is not compatible with CMS 13 yet. Re-add when updated.
    //public static IServiceCollection AddGetaSitemaps(
    //    this IServiceCollection services)
    //{
    //    services.AddSitemaps(x =>
    //    {
    //        x.EnableRealtimeCaching = true;
    //        x.EnableRealtimeSitemap = false;
    //    }, p => p.RequireRole(Roles.WebAdmins));
    //
    //    return services;
    //}

    public static IServiceCollection AddGetaNotFoundHandler(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // TODO: Geta.NotFoundHandler.Optimizely v6.0.0 is not compatible with CMS 13
        // (ScheduledPlugInAttribute.SortIndex was removed). Re-add when a compatible version is released.
        // Stott.Optimizely.RobotsHandler is not used in this solution. Keep robots handling in the
        // app's own middleware to avoid exposing menu items and authorization policies from a partially
        // integrated third-party admin module.

        return services;
    }
}