using PreciseAlloy.Models.Blocks;

namespace PreciseAlloy.Web.Features.Blocks.Avatar;

public class AvatarBlockViewModel
    : BlockViewModel<AvatarBlock>
{
    public AvatarBlockViewModel(AvatarBlock currentBlock)
        : base(currentBlock)
    {
    }
}
