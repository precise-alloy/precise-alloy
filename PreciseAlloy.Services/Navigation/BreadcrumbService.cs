using EPiServer;
using EPiServer.Core;
using EPiServer.Framework.Cache;
using PreciseAlloy.Models.Interfaces;
using PreciseAlloy.Models.Navigation;
using PreciseAlloy.Models.Pages;
using PreciseAlloy.Utils.Extensions;

namespace PreciseAlloy.Services.Navigation;

public class BreadcrumbService(
    IContentLoader contentLoader,
    ISynchronizedObjectInstanceCache cache,
    IContentCacheKeyCreator contentCacheKeyCreator)
    : IBreadcrumbService
{
    private const string CacheKey = "Breadcrumbs_{0}_{1}";

    public IEnumerable<BreadcrumbItem> GetBreadcrumbs(
        ContentReference contentReference)
    {
        var currentPage = contentLoader.Get<SitePageData>(contentReference);
        if (currentPage is not IHaveBreadcrumb || currentPage.HideBreadcrumb)
        {
            return Enumerable.Empty<BreadcrumbItem>();
        }
        var cacheKey = string.Format(CacheKey, currentPage.ContentLink.ID, currentPage.Language.Name);

        //Get breadcrumbs
        if (cache.Get(cacheKey) is List<BreadcrumbItem> breadcrumbs)
        {
            return breadcrumbs;
        }

        var currentLanguage = currentPage.Language;
        var languageOptions = new LoaderOptions { LanguageLoaderOption.FallbackWithMaster(currentLanguage) };

        var ancestors = contentLoader
            .GetAncestors(currentPage.ContentLink)
            .OfType<SitePageData>()
            .Select(ancestor => contentLoader.Get<SitePageData>(ancestor.ContentLink, languageOptions))
            .Where(content => content != null)
            .Reverse();

        breadcrumbs = ancestors.Select(item => new BreadcrumbItem()
        {
            Name = item.Name,
            Url = item.ContentLink.ToFriendlyUrl()
        }).ToList();

        //Add current page to breadcrumbs
        breadcrumbs.Add(new BreadcrumbItem
        {
            Name = currentPage.Name,
            Url = currentPage.ContentLink.ToFriendlyUrl()
        });

        var dependentCacheKeys = ancestors.Select(
                x => contentCacheKeyCreator.CreateLanguageCacheKey(x.ContentLink, currentLanguage.Name))
            .ToList();

        //Add current page to dependent cache keys
        dependentCacheKeys.Add(contentCacheKeyCreator.CreateLanguageCacheKey(currentPage.ContentLink, currentLanguage.Name));

        //Create breadcrumbs cache
        cache.Insert(cacheKey, breadcrumbs,
            new CacheEvictionPolicy(
                TimeSpan.FromDays(30),
                CacheTimeoutType.Absolute,
                dependentCacheKeys,
                null
            ));

        return breadcrumbs;
    }
}