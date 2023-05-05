using EPiServer.Web.Mvc;
using Microsoft.AspNetCore.Mvc;
using PreciseAlloy.Models.Blocks;
using PreciseAlloy.Models.Media;
using PreciseAlloy.Utils.Extensions;
using PreciseAlloy.Web.Features.Blocks.Image;

namespace PreciseAlloy.Web.Features.Blocks.Contact;

public class ContactBlockComponent : BlockComponent<ContactBlock>
{
    protected override IViewComponentResult InvokeComponent(ContactBlock currentContent)
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