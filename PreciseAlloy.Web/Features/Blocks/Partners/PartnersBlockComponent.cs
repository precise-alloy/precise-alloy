using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;
using PreciseAlloy.Models.Blocks;

namespace PreciseAlloy.Web.Features.Blocks.Partners;

public class PartnersBlockComponent
    : AsyncBlockComponent<PartnersBlock>
{
    protected override async Task<IViewComponentResult> InvokeComponentAsync(PartnersBlock currentContent)
    {
        var model = new PartnersBlockViewModel(currentContent);

        return await Task.FromResult(View(model));
    }
}
