using PreciseAlloy.Models.Media;

namespace PreciseAlloy.Models.Blocks.Contact;

public class ContactBlockViewModel(
    ContactBlock currentBlock) : BlockViewModel<ContactBlock>(currentBlock)
{
    public ImageViewModel? RightImage { get; set; }
}