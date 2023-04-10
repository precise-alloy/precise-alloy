using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;

namespace PreciseAlloy.Web.Features.Components.PeopleBlock;

public class PeopleBlockComponent
    : AsyncBlockComponent<Models.Blocks.PeopleBlock>
{
    protected override async Task<IViewComponentResult> InvokeComponentAsync(Models.Blocks.PeopleBlock currentContent)
    {
        var model = new PeopleBlockViewModel(currentContent);

        return await Task.FromResult(View(model));
    }
}
