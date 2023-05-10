using EPiServer.Web.Mvc;
using PreciseAlloy.Models.Pages;

namespace PreciseAlloy.Web.Features.Pages;

public class RazorPageModelBase<T>
    : RazorPageModel<T>
    where T : SitePageData
{
    public RazorPageModelBase(T currentContent)
    {
        CurrentContent = currentContent;
    }
}
