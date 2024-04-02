using System.Text;
using Microsoft.AspNetCore.Mvc;
using PreciseAlloy.Models.Settings;
using PreciseAlloy.Services.Settings;

namespace PreciseAlloy.Web.Controllers;

public class SeoController(
    ISettingsService settingsService,
    IHostEnvironment hostEnvironment)
    : Controller
{
    [Route("robots.txt")]
    [HttpGet]
    public ActionResult Index()
    {
        if (!hostEnvironment.IsProduction())
        {
            // Disallow all robots on non-production environments
            return Content("User-Agent: *\nDisallow: /", "text/plain", Encoding.UTF8);
        }

        var layoutSettings = settingsService.GetSiteSettings<LayoutSettings>();
        var robotsContent = layoutSettings?.RobotsTxtContent ?? string.Empty;
        return Content(robotsContent, "text/plain", Encoding.UTF8);
    }
}
