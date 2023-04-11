using EPiServer;
using EPiServer.Core;
using EPiServer.Web.Routing;
using Microsoft.Extensions.Logging;
using PreciseAlloy.Models.Pages;
using PreciseAlloy.Models.Settings;
using PreciseAlloy.Utils.Extensions;

namespace PreciseAlloy.Services.Settings;

public class SettingsService
    : ISettingsService
{
    private readonly IContentLoader _contentLoader;
    private readonly ILogger<SettingsService> _logger;
    private readonly IPageRouteHelper _pageRouteHelper;

    public SettingsService(
        IContentLoader contentLoader,
        ILogger<SettingsService> logger,
        IPageRouteHelper pageRouteHelper)
    {
        _contentLoader = contentLoader;
        _logger = logger;
        _pageRouteHelper = pageRouteHelper;
        _logger.EnterConstructor();
        _logger.ExitConstructor();
    }

    public LayoutSettings? GetLayoutSettings()
    {
        try
        {
            var layoutSettings = new LayoutSettings();

            // if( _contentLoader.GetPublishedOrNull<HomePage>(ContentReference.StartPage) is HomePage startPage)
            // {
            // }

            if (_pageRouteHelper.Page is SitePageData currentPage)
            {
                layoutSettings.HideHeader = currentPage.HideSiteHeader;
                layoutSettings.HideFooter = currentPage.HideSiteFooter;
            }

            return layoutSettings;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Cannot get layout settings");
            return null;
        }
    }
}
