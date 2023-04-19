using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;

namespace PreciseAlloy.Web.Features.Components.PartnerBlock;

public class PartnersBlockComponent
    : AsyncBlockComponent<Models.Blocks.PartnersBlock>
{
    protected override async Task<IViewComponentResult> InvokeComponentAsync(Models.Blocks.PartnersBlock currentContent)
    {
        var model = new PartnersBlockViewModel(currentContent);

        return await Task.FromResult(View(model));
    }
}
