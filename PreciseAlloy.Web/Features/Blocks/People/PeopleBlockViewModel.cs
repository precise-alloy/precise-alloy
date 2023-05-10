using PreciseAlloy.Models.Blocks;

namespace PreciseAlloy.Web.Features.Blocks.People;

public class PeopleBlockViewModel
    : BlockViewModel<PeopleBlock>
{
    public PeopleBlockViewModel(PeopleBlock currentBlock)
        : base(currentBlock)
    {
    }
}
