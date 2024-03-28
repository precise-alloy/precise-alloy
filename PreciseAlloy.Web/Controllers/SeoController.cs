using System.Text;
using Microsoft.AspNetCore.Mvc;
using PreciseAlloy.Models.Settings;
using PreciseAlloy.Services.Settings;

namespace PreciseAlloy.Web.Controllers;

public class SeoController(ISettingsService settingsService) : Controller
{
    [Route("robots.txt")]
    [HttpGet]
    public ActionResult Index()
    {
        var layoutSettings = settingsService.GetSiteSettings<LayoutSettings>();
        var robotsContent = layoutSettings?.RobotsTxtContent;

        if (string.IsNullOrWhiteSpace(robotsContent))
        {
            return NotFound();
        }
        return Content(robotsContent, "text/plain", Encoding.UTF8);
    }
}
