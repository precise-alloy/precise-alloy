using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PreciseAlloy.Web.Features.Plugins.ExtendedAdmin;

[Authorize(Roles = "WebAdmins,Administrators")]
[Route("[controller]")]
public class ExtendedAdminController
    : Controller
{
    [Route("[action]")]
    public IActionResult Index()
    {
        return View();
    }
}
