using EPiServer.Framework.DataAnnotations;
using EPiServer.Framework.Web;
using EPiServer.Framework.Web.Mvc;
using EPiServer.Web;
using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;
using PreciseAlloy.Models.Interfaces;
using PreciseAlloy.Models.Pages;
using PreciseAlloy.Services.Request;
using PreciseAlloy.Services.Settings;

namespace PreciseAlloy.Web.Features.Preview;

[TemplateDescriptor(
    Inherited = true,
    TemplateTypeCategory = TemplateTypeCategories.MvcController,
    Tags = new[] { RenderingTags.Preview, RenderingTags.Edit },
    AvailableWithoutTag = false)]
[VisitorGroupImpersonation]
[RequireClientResources]
public class PreviewController
    : ActionControllerBase, IRenderTemplate<IHasPreview>
{
    private readonly IRequestContext _requestContext;
    private readonly IContentLoader _contentLoader;
    private readonly ISettingsService _settingsService;

    public PreviewController(
        IRequestContext requestContext,
        IContentLoader contentLoader,
        ISettingsService settingsService)
    {
        _requestContext = requestContext;
        _contentLoader = contentLoader;
        _settingsService = settingsService;
    }

    public ActionResult Index(IContent currentContent)
    {
        var startPage = _contentLoader.Get<SitePageData>(SiteDefinition.Current.StartPage);

        _requestContext.SetPageSubstitute(startPage);
        _requestContext.IsBlockPreviewMode = true;

        return View("~/Features/Preview/Index.cshtml", currentContent);
    }
}
