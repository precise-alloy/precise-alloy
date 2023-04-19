using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using PreciseAlloy.Models.Blocks;
using PreciseAlloy.Models.Pages;
using PreciseAlloy.Models.Settings;
using PreciseAlloy.Services.Request;
using PreciseAlloy.Services.Settings;
using PreciseAlloy.Utils.Extensions;

namespace PreciseAlloy.Web.Features.ViewComponents.Footer;

public class FooterViewComponent : ViewComponent
{
    private readonly IRequestContext _requestContext;
    private readonly ISettingsService _settingsService;

    public FooterViewComponent(
        IRequestContext requestContext,
        ISettingsService settingsService)
    {
        _requestContext = requestContext;
        _settingsService = settingsService;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        var currentPage = _requestContext.CurrentPage() as SitePageData;
        if (_requestContext.IsBlockPreviewMode
            || currentPage?.HideSiteHeader == true)
        {
            return new ContentViewComponentResult(string.Empty);
        }

        var layoutSettings = _settingsService.GetSiteSettings<LayoutSettings>();
        var model = new FooterViewModel
        {
            SocialLinks = layoutSettings
                ?.SocialLinks
                .LoadContent<SocialLinkBlock>()
                .Where(l => !string.IsNullOrWhiteSpace(l.Icon) && l.Url != null),
            CopyrightText = layoutSettings?.CopyrightText
        };
        return await Task.FromResult(View("~/Features/Shared/_Footer.cshtml", model));
    }
}