using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using PreciseAlloy.Models.Pages;
using PreciseAlloy.Services.Request;

namespace PreciseAlloy.Web.Features.ViewComponents.Footer;

public class FooterViewComponent : ViewComponent
{
    private readonly IRequestContext _requestContext;

    public FooterViewComponent(IRequestContext requestContext)
    {
        _requestContext = requestContext;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        var currentPage = _requestContext.CurrentPage() as SitePageData;
        if (_requestContext.IsBlockPreviewMode
            || currentPage?.HideSiteHeader == true)
        {
            return new ContentViewComponentResult(string.Empty);
        }

        var model = new FooterViewModel();
        return await Task.FromResult(View("~/Features/Shared/_Footer.cshtml", model));
    }
}