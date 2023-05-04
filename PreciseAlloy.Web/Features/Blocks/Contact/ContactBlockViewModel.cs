using PreciseAlloy.Models.Blocks;
using PreciseAlloy.Web.Features.Blocks.Image;

namespace PreciseAlloy.Web.Features.Blocks.Contact;

public class ContactBlockViewModel
    : BlockViewModel<ContactBlock>
{
    public ContactBlockViewModel(ContactBlock currentBlock)
        : base(currentBlock)
    {
    }

    public ImageViewModel? RightImage { get; set; }
}