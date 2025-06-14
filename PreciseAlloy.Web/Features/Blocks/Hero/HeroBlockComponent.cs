using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;
using PreciseAlloy.Models.Blocks;

namespace PreciseAlloy.Web.Features.Blocks.Hero;

public class HeroBlockComponent
    : AsyncBlockComponent<HeroBlock>
{
    protected override async Task<IViewComponentResult> InvokeComponentAsync(
        HeroBlock currentContent)
    {
        var model = new HeroBlockViewModel(currentContent);

        return await Task.FromResult(View(model));
    }
}
