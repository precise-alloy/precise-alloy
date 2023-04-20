using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace PreciseAlloy.Web.Features.Components.ContactBlock;

public class ContactBlockComponent : BlockComponent<Models.Blocks.ContactBlock>
{
    protected override IViewComponentResult InvokeComponent(Models.Blocks.ContactBlock currentContent)
    {
        return View(currentContent);
    }
}