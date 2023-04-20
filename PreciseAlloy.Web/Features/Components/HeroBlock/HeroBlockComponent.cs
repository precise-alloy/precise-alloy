using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;

namespace PreciseAlloy.Web.Features.Components.HeroBlock;

public class HeroBlockComponent
    : AsyncBlockComponent<Models.Blocks.HeroBlock>
{
    protected override async Task<IViewComponentResult> InvokeComponentAsync(Models.Blocks.HeroBlock currentContent)
    {
        var model = new HeroBlockViewModel(currentContent);

        return await Task.FromResult(View(model));
    }
}
