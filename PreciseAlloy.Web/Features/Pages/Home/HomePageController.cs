using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;
using PreciseAlloy.Models.Pages;

namespace PreciseAlloy.Web.Features.Pages.Home;

public class HomePageController
    : PageController<HomePage>
{
    public IActionResult Index(HomePage currentPage)
    {
        var model = new HomePageViewModel(currentPage);

        return View(model);
    }
}
