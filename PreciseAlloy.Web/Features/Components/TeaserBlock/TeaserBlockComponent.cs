using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;

namespace PreciseAlloy.Web.Features.Components.TeaserBlock;

public class TeaserBlockComponent : AsyncBlockComponent<Models.Blocks.TeaserBlock>
{
    protected override async Task<IViewComponentResult> InvokeComponentAsync(Models.Blocks.TeaserBlock currentContent)
    {
        var model = new TeaserBlockViewModel(currentContent);

        return await Task.FromResult(View(model));
    }
}
