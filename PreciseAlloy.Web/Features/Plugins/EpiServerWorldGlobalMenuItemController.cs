using EPiServer.Shell.Navigation;
using Microsoft.AspNetCore.Mvc;

namespace PreciseAlloy.Web.Features.Plugins;

public class EpiServerWorldGlobalMenuItemController
    : Controller
{
    [MenuItem(
        MenuPaths.Global + "/globalLink",
        SortIndex = SortIndex.First - 10,
        Text = "Optimizely world",
        Url = "https://world.episerver.com/cms/")]
    public ActionResult Index(string viewName)
    {
        return View();
    }
}
