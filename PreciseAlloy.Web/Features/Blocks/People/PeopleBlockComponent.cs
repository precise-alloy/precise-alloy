using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;
using PreciseAlloy.Models.Blocks;

namespace PreciseAlloy.Web.Features.Blocks.People;

public class PeopleBlockComponent
    : AsyncBlockComponent<PeopleBlock>
{
    protected override async Task<IViewComponentResult> InvokeComponentAsync(PeopleBlock currentContent)
    {
        var model = new PeopleBlockViewModel(currentContent);

        return await Task.FromResult(View(model));
    }
}
