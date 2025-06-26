using Microsoft.Extensions.Options;
using PreciseAlloy.Web.Infrastructure.Models;

namespace PreciseAlloy.Web.Infrastructure.Middlewares;

public class RobotsHeaderMiddleware(
    RequestDelegate next,
    IWebHostEnvironment webHostEnvironment,
    IOptions<SeoOptions> seoOptions)
{
    public async Task Invoke(
        HttpContext httpContext)
    {
        bool blockRobots = !webHostEnvironment.IsProduction()
                           || seoOptions
                               .Value
                               ?.NoRobotsDomains
                               ?.Any(d => d.Equals(httpContext.Request.Host.Host, StringComparison.OrdinalIgnoreCase)
                                          || (d.StartsWith('.')
                                              && httpContext.Request.Host.Host.EndsWith(d, StringComparison.OrdinalIgnoreCase))) == true;

        if (blockRobots)
        {
            httpContext.Response.Headers["x-robots-tag"] = "noindex,nofollow,nocache,nosnippet,noarchive";
        }

        await next(httpContext);
    }
}