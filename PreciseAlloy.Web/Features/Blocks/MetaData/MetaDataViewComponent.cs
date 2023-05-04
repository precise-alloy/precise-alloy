using EPiServer.Cms.Shell;
using Microsoft.AspNetCore.Mvc;
using PreciseAlloy.Models.Pages;
using PreciseAlloy.Models.Settings;
using PreciseAlloy.Services.Request;
using PreciseAlloy.Services.Settings;
using PreciseAlloy.Utils.Extensions;

namespace PreciseAlloy.Web.Features.Blocks.MetaData;

public class MetaDataViewComponent : ViewComponent
{
    private readonly IRequestContext _requestContext;
    private readonly ISettingsService _settingsService;

    public MetaDataViewComponent(
        IRequestContext requestContext,
        ISettingsService settingsService)
    {
        _requestContext = requestContext;
        _settingsService = settingsService;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        var layoutSettings = _settingsService.GetSiteSettings<LayoutSettings>();
        var currentPage = _requestContext.CurrentPage() as SitePageData;

        var browserTitle = currentPage?.MetaTitle + " | First Mile";

        var model = new Models.Layout.MetaData
        {
            BrowserTitle = browserTitle,
            PageTitle = currentPage?.PageName,
            MetaKeywords = currentPage?.MetaKeywords?.Length > 0 ? string.Join(",", currentPage.MetaKeywords) : null,
            MetaDescription = currentPage?.MetaDescription,
            MetaRobots = currentPage?.DisableFollow == true || currentPage?.DisableIndexing == true
                ? (currentPage.DisableIndexing ? "noindex" : "index") + ", " + (currentPage.DisableFollow ? "nofollow" : "follow")
                : null,
            CanonicalUrl = currentPage.ToExternalUrl(),
            SocialMediaImage = layoutSettings?.SocialShareImageUrl?.GetUrl(),
        };

        return await Task.FromResult(View(model));
    }
}
