using PreciseAlloy.Models.Pages;
using EPiServer.Core;
using EPiServer.Find.Cms;

namespace PreciseAlloy.Services.Find;

public interface IFindService
{
    IContentResult<T>? Search<T>(FindQuery query) where T : SitePageData;

    IContentResult<T>? Search<T>(FindQuery query, out int totalRows) where T : SitePageData;

    IContentResult<T>? GetBlocks<T>(FindQuery query) where T : BlockData;
}
