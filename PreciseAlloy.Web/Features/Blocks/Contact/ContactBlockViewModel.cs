using PreciseAlloy.Models.Blocks;
using PreciseAlloy.Web.Features.Blocks.Image;

namespace PreciseAlloy.Web.Features.Blocks.Contact;

public class ContactBlockViewModel(ContactBlock currentBlock) : BlockViewModel<ContactBlock>(currentBlock)
{
    public ImageViewModel? RightImage { get; set; }
}