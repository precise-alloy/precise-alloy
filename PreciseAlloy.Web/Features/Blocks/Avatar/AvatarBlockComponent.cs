using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;
using PreciseAlloy.Models.Blocks;

namespace PreciseAlloy.Web.Features.Blocks.Avatar;

public class AvatarBlockComponent:AsyncBlockComponent<AvatarBlock>
{
    protected override async Task<IViewComponentResult> InvokeComponentAsync(AvatarBlock currentContent)
    {
        var model = new AvatarBlockViewModel(currentContent);
        return await Task.FromResult(View(model));
    }
}
