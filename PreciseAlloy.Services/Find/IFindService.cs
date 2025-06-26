using EPiServer.Core;
using EPiServer.Find.Cms;
using PreciseAlloy.Models.Pages;

namespace PreciseAlloy.Services.Find;

public interface IFindService
{
    Task<IContentResult<T>?> SearchAsync<T>(FindQuery query) where T : SitePageData;

    Task<IContentResult<T>?> GetBlocksAsync<T>(FindQuery query) where T : BlockData;
}