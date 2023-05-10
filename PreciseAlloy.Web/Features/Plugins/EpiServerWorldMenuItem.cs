using EPiServer.Shell.Navigation;
using Microsoft.AspNetCore.Mvc;

namespace PreciseAlloy.Web.Features.Plugins;
public class EpiServerWorldMenuItem : Controller
{
    [MenuItem(
        MenuPaths.UserSettings,
        SortIndex = SortIndex.First - 10,
        Text = "About Optimizely",
        Url = "https://www.episerver.com/about/company/overview/")]
    public IActionResult Index(string viewName)
    {
        return Ok("Test View");
    }
}
