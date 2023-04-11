using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using PreciseAlloy.Models.Pages;
using PreciseAlloy.Services.Request;

namespace PreciseAlloy.Web.Features.ViewComponents;

public class HeaderViewComponent : ViewComponent
{
    private readonly IRequestContext _requestContext;

    public HeaderViewComponent(IRequestContext requestContext)
    {
        _requestContext = requestContext;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        var layoutSettings = _requestContext.GetLayoutSettings();

        var currentPage = _requestContext.CurrentPage() as SitePageData;

        if (layoutSettings?.IsBlockPreviewMode == true
            || currentPage?.HideSiteHeader == true)
        {
            return new ContentViewComponentResult(string.Empty);
        }

        return await Task.FromResult(View("~/Features/Shared/_Header.cshtml", layoutSettings));
    }
}
