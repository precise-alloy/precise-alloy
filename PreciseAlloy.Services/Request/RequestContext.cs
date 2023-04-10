using EPiServer;
using EPiServer.Core;
using EPiServer.Web.Routing;
using Microsoft.AspNetCore.Http;
using PreciseAlloy.Models.Settings;
using PreciseAlloy.Services.Settings;

namespace PreciseAlloy.Services.Request;

public class RequestContext
    : IRequestContext
{
    private static readonly object NullObject = new();
    private readonly IContentLoader _contentLoader;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IPageRouteHelper _pageRouteHelper;
    private readonly ISettingsService _settingsService;

    public RequestContext(
        IContentLoader contentLoader,
        IHttpContextAccessor httpContextAccessor,
        IPageRouteHelper pageRouteHelper,
        ISettingsService settingsService)
    {
        _contentLoader = contentLoader;
        _httpContextAccessor = httpContextAccessor;
        _pageRouteHelper = pageRouteHelper;
        _settingsService = settingsService;
    }

    public PageData? CurrentPage()
    {
        return ForceGet(
            "Context::CurrentPage",
            () =>
            {
                // Replicating CMS 11 behavior - returning Start Page, if current page is not defined
                var pageLink = _pageRouteHelper.PageLink;
                pageLink = !ContentReference.IsNullOrEmpty(pageLink)
                    ? pageLink
                    : ContentReference.StartPage;

                return _contentLoader.TryGet<PageData>(pageLink, out var result)
                    ? result
                    : _pageRouteHelper.Page;
            });
    }

    public LayoutSettings? GetLayoutSettings()
    {
        return ForceGet("Context::CurrentLayoutSettings", () => _settingsService.GetLayoutSettings());
    }

    public void SetPageSubstitute(PageData page)
    {
        RemoveKey("Context::CurrentLayoutSettings");
        RemoveKey("Context::CurrentDigitalData");

        RemoveKey("Context::CurrentPage");
        ForceGet("Context::CurrentPage", () => page);
    }

    private void RemoveKey(string key)
    {
        var items = _httpContextAccessor.HttpContext?.Items;
        if (items?.ContainsKey(key) == true)
        {
            items.Remove(key);
        }
    }

    private TEntity? ForceGet<TEntity>(string key, Func<TEntity?> getEntity)
        where TEntity : class
    {
        var items = _httpContextAccessor.HttpContext?.Items;

        var cachedValue = items?[key];
        if (cachedValue == NullObject)
        {
            return null;
        }

        if (cachedValue != null)
        {
            return (TEntity)cachedValue;
        }

        var result = getEntity();
        if (items != null)
        {
            items[key] = result ?? NullObject;
        }

        return result;
    }
}
