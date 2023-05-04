using EPiServer.Shell.Navigation;
using Microsoft.AspNetCore.Mvc;

namespace PreciseAlloy.Web.Features.Plugins;

public class ExtendedAdminController : Controller
{
    [MenuItem(
        menuPath: "/global/cms/admin/extension",
        Text = "Admin Extension",
        SortIndex = 60)]
    public IActionResult Index()
    {
        return Ok("Test View");
    }
}
