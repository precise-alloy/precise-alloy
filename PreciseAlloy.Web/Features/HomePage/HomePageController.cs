using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;
using PreciseAlloy.Models.Pages;

namespace PreciseAlloy.Web.Features.Home;

public class HomePageController
    : PageController<HomePage>
{
    public IActionResult Index(HomePage currentPage)
    {
        return View();
    }
}
