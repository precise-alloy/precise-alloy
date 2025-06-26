using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;
using PreciseAlloy.Models.Blocks.Header;
using PreciseAlloy.Utils.Extensions;

namespace PreciseAlloy.Web.Features.Blocks.StandardHeader;

public class StandardHeaderViewComponent
    : AsyncBlockComponent<StandardHeaderBlock>
{
    protected override async Task<IViewComponentResult> InvokeComponentAsync(
        StandardHeaderBlock currentContent)
    {
        var model = new StandardHeaderViewModel
        {
            CompanyName = currentContent.CompanyName,
            LogoSrc = currentContent.LogoImage?.GetUrl(),
            LogoUrl = currentContent.LogoUrl?.GetUrl(),
            LogoAlternativeText = currentContent.HeaderLogoAlternativeText,
            Menu = currentContent.HeaderMenu
        };

        return await Task.FromResult(View(model));
    }
}