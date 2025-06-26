using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewComponents;
using PreciseAlloy.Models.Blocks.Footer;
using PreciseAlloy.Models.Blocks.SocialLink;
using PreciseAlloy.Models.Pages;
using PreciseAlloy.Services.Request;
using PreciseAlloy.Utils.Extensions;

namespace PreciseAlloy.Web.Features.Blocks.StandardFooter;

public class StandardFooterViewComponent(
    IRequestContext requestContext)
    : AsyncBlockComponent<StandardFooterBlock>
{
    protected override async Task<IViewComponentResult> InvokeComponentAsync(
        StandardFooterBlock currentContent)
    {
        var currentPage = requestContext.CurrentPage() as SitePageData;
        if (requestContext.IsBlockPreviewMode
            || currentPage?.HideSiteHeader == true)
        {
            return new ContentViewComponentResult(string.Empty);
        }

        var model = new StandardFooterViewModel
        {
            SocialLinks = currentContent
                ?.SocialLinks
                .LoadContent<SocialLinkBlock>()
                .Where(l => !string.IsNullOrWhiteSpace(l.Icon) && l.Url != null),
            CopyrightText = currentContent?.CopyrightText
        };

        return await Task.FromResult(View(model));
    }
}