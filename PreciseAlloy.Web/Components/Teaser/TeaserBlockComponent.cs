using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;
using PreciseAlloy.Models.Blocks;

namespace PreciseAlloy.Web.Components.Teaser
{
    public class TeaserBlockComponent : AsyncBlockComponent<TeaserBlock>
    {
        protected override async Task<IViewComponentResult> InvokeComponentAsync(TeaserBlock currentContent)
        {
            var model = new TeaserBlockViewModel(currentContent);

            return await Task.FromResult(View(model));
        }
    }
}
