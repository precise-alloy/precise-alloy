using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using PreciseAlloy.Models.Blocks.Header;
using PreciseAlloy.Models.Pages;
using PreciseAlloy.Models.Settings;
using PreciseAlloy.Services.Request;
using PreciseAlloy.Services.Settings;

namespace PreciseAlloy.Web.Features.Blocks.Header;

public class HeaderViewComponent(
    IContentLoader contentLoader,
    IRequestContext requestContext,
    ISettingsService settingsService)
    : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync()
    {
        var currentPage = requestContext.CurrentPage() as SitePageData;
        var layoutSettings = settingsService.GetSiteSettings<LayoutSettings>();

        if (requestContext.IsBlockPreviewMode
            || currentPage?.HideSiteHeader == true
            || ContentReference.IsNullOrEmpty(layoutSettings?.Header))
        {
            return new ContentViewComponentResult(string.Empty);
        }

        var header = contentLoader.Get<BaseHeaderBlock>(layoutSettings?.Header);


        if (header is not null)
        {
            return await Task.FromResult(View(header));
        }

        return new ContentViewComponentResult(string.Empty);
    }
}