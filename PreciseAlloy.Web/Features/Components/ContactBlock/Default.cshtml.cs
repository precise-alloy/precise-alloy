using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using PreciseAlloy.Models.Media;
using PreciseAlloy.Utils.Extensions;
using PreciseAlloy.Web.Features.Components.ImageView;

namespace PreciseAlloy.Web.Features.Components.ContactBlock;

public class ContactBlockComponent : BlockComponent<Models.Blocks.ContactBlock>
{
    protected override IViewComponentResult InvokeComponent(Models.Blocks.ContactBlock currentContent)
    {
        ContactBlockViewModel viewModel = new(currentContent);
        if (!ContentReference.IsNullOrEmpty(currentContent.RightImage))
        {
            ImageInfo? imageInfo = currentContent.RightImage!.GetImageInfo("", "");
            if (imageInfo != null)
            {
                viewModel.RightImage = new ImageViewModel(imageInfo!);
            }
        }
        return View(viewModel);
    }
}