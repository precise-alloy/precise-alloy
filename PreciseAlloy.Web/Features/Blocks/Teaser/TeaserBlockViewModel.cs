using PreciseAlloy.Models.Blocks;

namespace PreciseAlloy.Web.Features.Blocks.Teaser;

public class TeaserBlockViewModel
    : BlockViewModel<TeaserBlock>
{
    public TeaserBlockViewModel(TeaserBlock currentBlock)
        : base(currentBlock)
    {
    }
}
