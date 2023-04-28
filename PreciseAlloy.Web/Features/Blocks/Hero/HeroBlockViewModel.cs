using PreciseAlloy.Models.Blocks;

namespace PreciseAlloy.Web.Features.Blocks.Hero;

public class HeroBlockViewModel
    : BlockViewModel<HeroBlock>
{
    public HeroBlockViewModel(HeroBlock currentBlock)
        : base(currentBlock)
    {
    }
}
