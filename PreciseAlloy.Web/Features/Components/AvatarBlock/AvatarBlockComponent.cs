using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;

namespace PreciseAlloy.Web.Features.Components.AvatarBlock;

public class AvatarBlockComponent:AsyncBlockComponent<Models.Blocks.AvatarBlock>
{
    protected override async Task<IViewComponentResult> InvokeComponentAsync(Models.Blocks.AvatarBlock currentContent)
    {
        var model = new AvatarBlockViewModel(currentContent);
        return await Task.FromResult(View(model));
    }
}
