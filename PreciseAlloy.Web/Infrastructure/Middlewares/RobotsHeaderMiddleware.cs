using Microsoft.Extensions.Options;
using PreciseAlloy.Web.Infrastructure.Models;

namespace PreciseAlloy.Web.Infrastructure.Middlewares;

/// <summary>
///     Middleware that conditionally adds an <c>x-robots-tag</c> HTTP header to responses,
///     instructing search engines not to index, follow, cache, or archive pages.
///     The header is applied if the application is not running in production, or if the current
///     request's host matches any domain specified in <see cref="SeoOptions.NoRobotsDomains" />.
///     This helps prevent search engines from indexing non-production environments or specific domains.
/// </summary>
/// <param name="next"></param>
/// <param name="webHostEnvironment"></param>
/// <param name="seoOptions"></param>
public class RobotsHeaderMiddleware(
    RequestDelegate next,
    IWebHostEnvironment webHostEnvironment,
    IOptions<SeoOptions> seoOptions)
{
    public async Task Invoke(
        HttpContext httpContext)
    {
        var blockRobots = !webHostEnvironment.IsProduction()
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