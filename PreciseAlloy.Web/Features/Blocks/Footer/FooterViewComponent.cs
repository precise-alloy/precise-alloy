using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using PreciseAlloy.Models.Blocks;
using PreciseAlloy.Models.Pages;
using PreciseAlloy.Models.Settings;
using PreciseAlloy.Services.Request;
using PreciseAlloy.Services.Settings;
using PreciseAlloy.Utils.Extensions;

namespace PreciseAlloy.Web.Features.Blocks.Footer;

public class FooterViewComponent(
    IRequestContext requestContext,
    ISettingsService settingsService)
    : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync()
    {
        var currentPage = requestContext.CurrentPage() as SitePageData;
        if (requestContext.IsBlockPreviewMode
            || currentPage?.HideSiteHeader == true)
        {
            return new ContentViewComponentResult(string.Empty);
        }

        var layoutSettings = settingsService.GetSiteSettings<LayoutSettings>();
        var model = new FooterViewModel
        {
            SocialLinks = layoutSettings
                ?.SocialLinks
                .LoadContent<SocialLinkBlock>()
                .Where(l => !string.IsNullOrWhiteSpace(l.Icon) && l.Url != null),
            CopyrightText = layoutSettings?.CopyrightText
        };
        return await Task.FromResult(View(model));
    }
}