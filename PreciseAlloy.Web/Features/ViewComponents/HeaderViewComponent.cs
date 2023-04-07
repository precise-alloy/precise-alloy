using Microsoft.AspNetCore.Mvc;

namespace PreciseAlloy.Web.Features.ViewComponents;

public class HeaderViewComponent : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync()
    {
        return await Task.FromResult(View("~/Features/Shared/_Header.cshtml"));
    }
}
