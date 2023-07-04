using System.Text;
using Microsoft.AspNetCore.Mvc;
using PreciseAlloy.Models.Settings;
using PreciseAlloy.Services.Settings;

namespace PreciseAlloy.Web.Controllers;

public class SeoController
    : Controller
{
    private readonly ISettingsService _settingsService;
    public SeoController(ISettingsService settingsService)
    {
        _settingsService = settingsService;
    }

    [Route("robots.txt")]
    [HttpGet]
    public ActionResult Index()
    {
        var layoutSettings = _settingsService.GetSiteSettings<LayoutSettings>();
        var robotsContent = layoutSettings?.RobotsTxtContent;

        if (string.IsNullOrWhiteSpace(robotsContent))
        {
            return NotFound();
        }
        return Content(robotsContent, "text/plain", Encoding.UTF8);
    }
}
