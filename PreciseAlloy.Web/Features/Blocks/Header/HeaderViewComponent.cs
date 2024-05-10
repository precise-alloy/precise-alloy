using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using PreciseAlloy.Models.Pages;
using PreciseAlloy.Models.Settings;
using PreciseAlloy.Services.Request;
using PreciseAlloy.Services.Settings;
using PreciseAlloy.Utils.Extensions;

namespace PreciseAlloy.Web.Features.Blocks.Header;

public class HeaderViewComponent(
    IRequestContext requestContext,
    ISettingsService settingsService)
    : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync()
    {
        var currentPage = requestContext.CurrentPage() as SitePageData;
        var layoutSettings = settingsService.GetSiteSettings<LayoutSettings>();

        if (requestContext.IsBlockPreviewMode
            || currentPage?.HideSiteHeader == true)
        {
            return new ContentViewComponentResult(string.Empty);
        }

        var model = new HeaderViewModel
        {
            CompanyName = layoutSettings?.CompanyName,
            LogoUrl = layoutSettings?.HeaderLogoUrl?.GetUrl(),
            LogoAlternativeText = layoutSettings?.HeaderLogoAlternativeText,
            Menu = layoutSettings?.HeaderMenu
        };

        return await Task.FromResult(View(model));
    }
}
