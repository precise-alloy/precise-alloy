using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using PreciseAlloy.Models.Pages;
using PreciseAlloy.Models.Settings;
using PreciseAlloy.Services.Request;
using PreciseAlloy.Services.Settings;
using PreciseAlloy.Utils.Extensions;

namespace PreciseAlloy.Web.Features.Blocks.Header;

public class HeaderViewComponent : ViewComponent
{
    private readonly IRequestContext _requestContext;
    private readonly ISettingsService _settingsService;

    public HeaderViewComponent(
        IRequestContext requestContext,
        ISettingsService settingsService)
    {
        _requestContext = requestContext;
        _settingsService = settingsService;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        var currentPage = _requestContext.CurrentPage() as SitePageData;
        var layoutSettings = _settingsService.GetSiteSettings<LayoutSettings>();

        if (_requestContext.IsBlockPreviewMode
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
