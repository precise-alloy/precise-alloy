using PreciseAlloy.Web.Features.Components.ImageView;

namespace PreciseAlloy.Web.Features.Components.ContactBlock;

public class ContactBlockViewModel : BlockViewModel<Models.Blocks.ContactBlock>
{
    public ContactBlockViewModel(Models.Blocks.ContactBlock currentBlock) : base(currentBlock)
    {
    }

    public ImageViewModel? RightImage { get; set; }
}