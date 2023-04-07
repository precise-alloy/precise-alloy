using PreciseAlloy.Models.Blocks;

namespace PreciseAlloy.Web.Components.Teaser
{
    public class TeaserBlockViewModel
        : BlockViewModel<TeaserBlock>
    {
        public TeaserBlockViewModel(TeaserBlock currentBlock)
            : base(currentBlock)
        {
        }
    }
}
