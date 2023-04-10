using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;

namespace PreciseAlloy.Web.Features.HomePage;

public class HomePageController
    : PageController<Models.Pages.HomePage>
{
    public IActionResult Index(Models.Pages.HomePage currentPage)
    {
        var model = new HomePageViewModel(currentPage);

        return View(model);
    }
}
