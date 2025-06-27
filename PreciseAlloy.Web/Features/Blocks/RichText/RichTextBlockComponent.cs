using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;
using PreciseAlloy.Models.Blocks.RichText;

namespace PreciseAlloy.Web.Features.Blocks.RichText;

public class RichTextBlockComponent
    : AsyncBlockComponent<RichTextBlock>
{
    protected override async Task<IViewComponentResult> InvokeComponentAsync(
        RichTextBlock currentContent)
    {
        var model = new RichTextBlockViewModel(currentContent);

        return await Task.FromResult(View(model));
    }
}