using EPiServer.Framework.DataAnnotations;
using EPiServer.Framework.Web;
using EPiServer.Framework.Web.Mvc;
using EPiServer.Web;
using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;
using PreciseAlloy.Models.Interfaces;
using PreciseAlloy.Models.Pages;
using PreciseAlloy.Services.Request;

namespace PreciseAlloy.Web.Features.Pages.Preview;

[TemplateDescriptor(
    Inherited = true,
    TemplateTypeCategory = TemplateTypeCategories.MvcController,
    Tags = new[] { RenderingTags.Preview, RenderingTags.Edit },
    AvailableWithoutTag = false)]
[VisitorGroupImpersonation]
[RequireClientResources]
public class PreviewPageController(
    IRequestContext requestContext,
    IContentLoader contentLoader)
    : ActionControllerBase, IRenderTemplate<IHasPreview>
{
    public ActionResult Index(IContent currentContent)
    {
        var startPage = contentLoader.Get<SitePageData>(SiteDefinition.Current.StartPage);

        requestContext.SetPageSubstitute(startPage);
        requestContext.IsBlockPreviewMode = true;

        return View(currentContent);
    }
}
