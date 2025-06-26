using EPiServer.Web.Mvc;
using PreciseAlloy.Models.Interfaces;

namespace PreciseAlloy.Models.Pages;

public class RazorPageModelBase<T>
    : RazorPageModel<T>, IPageViewModel
    where T : SitePageData
{
    public RazorPageModelBase(
        T currentContent)
    {
        CurrentContent = currentContent;
        ClassName = currentContent.ClassName;
    }

    public string ClassName { get; }
}