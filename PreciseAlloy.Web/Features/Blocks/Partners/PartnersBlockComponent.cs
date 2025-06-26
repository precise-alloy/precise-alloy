using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;
using PreciseAlloy.Models.Blocks.Partner;
using PreciseAlloy.Utils.Extensions;

namespace PreciseAlloy.Web.Features.Blocks.Partners;

public class PartnersBlockComponent
    : AsyncBlockComponent<PartnersBlock>
{
    protected override async Task<IViewComponentResult> InvokeComponentAsync(
        PartnersBlock currentContent)
    {
        PartnersBlockViewModel model = new(currentContent)
        {
            Partners = currentContent.Partners.LoadContent<PartnerBlock>().ToList()
        };

        return await Task.FromResult(View(model));
    }
}