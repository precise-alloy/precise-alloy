using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;
using PreciseAlloy.Models.Blocks.Teaser;

namespace PreciseAlloy.Web.Features.Blocks.Teaser;

public class TeaserBlockComponent : AsyncBlockComponent<TeaserBlock>
{
    protected override async Task<IViewComponentResult> InvokeComponentAsync(TeaserBlock currentContent)
    {
        TeaserBlockViewModel model = new(currentContent);

        return await Task.FromResult(View(model));
    }
}