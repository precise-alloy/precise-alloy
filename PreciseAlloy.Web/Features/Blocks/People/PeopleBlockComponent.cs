using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;
using PreciseAlloy.Models.Blocks.People;

namespace PreciseAlloy.Web.Features.Blocks.People;

public class PeopleBlockComponent
    : AsyncBlockComponent<PeopleBlock>
{
    protected override async Task<IViewComponentResult> InvokeComponentAsync(PeopleBlock currentContent)
    {
        PeopleBlockViewModel model = new(currentContent);

        return await Task.FromResult(View(model));
    }
}