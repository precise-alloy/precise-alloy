using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using PreciseAlloy.Models.Blocks.Footer;
using PreciseAlloy.Models.Pages;
using PreciseAlloy.Models.Settings;
using PreciseAlloy.Services.Request;
using PreciseAlloy.Services.Settings;

namespace PreciseAlloy.Web.Features.Blocks.Footer;

public class FooterViewComponent(
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
            || ContentReference.IsNullOrEmpty(layoutSettings?.Footer))
        {
            return new ContentViewComponentResult(string.Empty);
        }

        var footer = contentLoader.Get<BaseFooterBlock>(
            layoutSettings?.Footer);

        if (footer is not null)
        {
            return await Task.FromResult(View(footer));
        }

        return new ContentViewComponentResult(string.Empty);
    }
}