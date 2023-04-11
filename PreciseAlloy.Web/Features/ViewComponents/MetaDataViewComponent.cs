using EPiServer.Cms.Shell;
using Microsoft.AspNetCore.Mvc;
using PreciseAlloy.Models.Layout;
using PreciseAlloy.Models.Pages;
using PreciseAlloy.Services.Request;
using PreciseAlloy.Services.Settings;

namespace PreciseAlloy.Web.Features.ViewComponents;

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
        var layoutSettings = _requestContext.GetLayoutSettings();
        var currentPage = _requestContext.CurrentPage() as SitePageData;

        var browserTitle = currentPage?.MetaTitle + " | First Mile";

        var model = new MetaData
        {
            BrowserTitle = browserTitle,
            PageTitle = currentPage?.PageName,
            MetaKeywords = currentPage?.MetaKeywords?.Length > 0 ? string.Join(",", currentPage.MetaKeywords) : null,
            MetaDescription = currentPage?.MetaDescription,
            MetaRobots = currentPage?.DisableFollow == true || currentPage?.DisableIndexing == true
                ? (currentPage.DisableIndexing ? "noindex" : "index") + ", " + (currentPage.DisableFollow ? "nofollow" : "follow")
                : null,
            CanonicalUrl = currentPage.ToExternalUrl(),
            SocialMediaImage = layoutSettings?.SocialShareImageUrl,
        };

        return await Task.FromResult(View("~/Features/Shared/_MetaData.cshtml", model));
    }
}
