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
public class PreviewPageController
    : ActionControllerBase, IRenderTemplate<IHasPreview>
{
    private readonly IRequestContext _requestContext;
    private readonly IContentLoader _contentLoader;

    public PreviewPageController(
        IRequestContext requestContext,
        IContentLoader contentLoader)
    {
        _requestContext = requestContext;
        _contentLoader = contentLoader;
    }

    public ActionResult Index(IContent currentContent)
    {
        var startPage = _contentLoader.Get<SitePageData>(SiteDefinition.Current.StartPage);

        _requestContext.SetPageSubstitute(startPage);
        _requestContext.IsBlockPreviewMode = true;

        return View(currentContent);
    }
}
