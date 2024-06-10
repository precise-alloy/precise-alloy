using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PreciseAlloy.Web.Features.Plugins.EpiServerWorld;

[Authorize(Roles = "CmsEditors")]
[Route("[controller]")]
public class EpiServerWorldController
    : Controller
{
    [Route("[action]")]
    public ActionResult Index()
    {
        return View();
    }
}
