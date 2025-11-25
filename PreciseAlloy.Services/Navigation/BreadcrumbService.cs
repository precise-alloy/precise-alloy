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
            return [];
        }

        var cacheKey = string.Format(CacheKey, currentPage.ContentLink.ID, currentPage.Language.Name);

        //Get breadcrumbs
        if (cache.Get(cacheKey) is List<BreadcrumbItem> cachedBreadcrumbs)
        {
            return cachedBreadcrumbs;
        }

        var currentLanguage = currentPage.Language;
        var languageOptions = new LoaderOptions { LanguageLoaderOption.FallbackWithMaster(currentLanguage) };

        var ancestors = contentLoader
            .GetAncestors(currentPage.ContentLink)
            .OfType<SitePageData>()
            .Select(ancestor => contentLoader.Get<SitePageData>(ancestor.ContentLink, languageOptions))
            .Where(content => content != null)
            .Reverse();

        var breadcrumbs = new List<BreadcrumbItem>();
        var dependentCacheKeys = new List<string>();

        foreach (var ancestor in ancestors)
        {
            breadcrumbs.Add(new BreadcrumbItem
            {
                Name = ancestor.Name,
                Url = ancestor.ContentLink.ToFriendlyUrl()
            });

            dependentCacheKeys.Add(contentCacheKeyCreator.CreateLanguageCacheKey(ancestor.ContentLink, currentLanguage.Name));
        }

        //Add current page to breadcrumbs
        breadcrumbs.Add(new BreadcrumbItem
        {
            Name = currentPage.Name,
            Url = currentPage.ContentLink.ToFriendlyUrl()
        });

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