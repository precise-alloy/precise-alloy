using EPiServer;
using EPiServer.Core;
using EPiServer.Web.Routing;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using PreciseAlloy.Models.Settings;
using PreciseAlloy.Services.Settings;
using PreciseAlloy.Utils.Extensions;

namespace PreciseAlloy.Services.Request;

public class RequestContext
    : IRequestContext
{
    private static readonly object NullObject = new();
    private readonly IContentLoader _contentLoader;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<RequestContext> _logger;
    private readonly IPageRouteHelper _pageRouteHelper;
    private readonly ISettingsService _settingsService;
    private const string CurrentPageContext = "Context::CurrentPage";
    private const string CurrentLayoutSettingsContext = "Context::CurrentLayoutSettings";
    private const string CurrentDigitalDataContext = "Context::CurrentDigitalData";

    public RequestContext(
        IContentLoader contentLoader,
        IHttpContextAccessor httpContextAccessor,
        ILogger<RequestContext> logger,
        IPageRouteHelper pageRouteHelper,
        ISettingsService settingsService)
    {
        _logger = logger;
        _logger.EnterConstructor();
        _contentLoader = contentLoader;
        _httpContextAccessor = httpContextAccessor;
        _pageRouteHelper = pageRouteHelper;
        _settingsService = settingsService;
        _logger.ExitConstructor();
    }

    public PageData? CurrentPage()
    {
        _logger.EnterMethod();

        var page = ForceGet(CurrentPageContext, GetCurrentPage);

        _logger.ExitMethod();
        return page;
    }

    private PageData? GetCurrentPage()
    {
        // Replicating CMS 11 behavior - returning Start Page, if current page is not defined
        var pageLink = _pageRouteHelper.PageLink;
        pageLink = !ContentReference.IsNullOrEmpty(pageLink)
            ? pageLink
            : ContentReference.StartPage;

        return _contentLoader.TryGet<PageData>(pageLink, out var result)
            ? result
            : _pageRouteHelper.Page;
    }

    public LayoutSettings? GetLayoutSettings()
    {
        _logger.EnterMethod();

        var layoutSettings = ForceGet(CurrentLayoutSettingsContext, _settingsService.GetLayoutSettings);

        _logger.ExitMethod();

        return layoutSettings;
    }

    public void SetPageSubstitute(PageData page)
    {
        _logger.EnterMethod();

        RemoveKey(CurrentLayoutSettingsContext);
        RemoveKey(CurrentDigitalDataContext);

        RemoveKey(CurrentPageContext);
        ForceGet(CurrentPageContext, () => page);

        _logger.ExitMethod();
    }

    private void RemoveKey(string key)
    {
        _logger.EnterMethod();

        var items = _httpContextAccessor.HttpContext?.Items;
        if (items?.ContainsKey(key) == true)
        {
            items.Remove(key);
        }

        _logger.ExitMethod();
    }

    private TEntity? ForceGet<TEntity>(string key, Func<TEntity?> getEntity)
        where TEntity : class
    {
        _logger.EnterMethod();

        var items = _httpContextAccessor.HttpContext?.Items;

        var cachedValue = items?[key];
        if (cachedValue == NullObject)
        {
            _logger.ExitMethod("Cache exist with null value");
            return null;
        }

        if (cachedValue != null)
        {
            var value = (TEntity)cachedValue;

            _logger.ExitMethod("Cache exist with non-null value");
            return value;
        }

        var result = getEntity();
        if (items != null)
        {
            items[key] = result ?? NullObject;
        }

        _logger.ExitMethod();
        return result;
    }
}
