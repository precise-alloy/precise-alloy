namespace PreciseAlloy.Models.Blocks.Partner;

public class PartnersBlockViewModel(
    PartnersBlock currentBlock)
    : BlockViewModel<PartnersBlock>(currentBlock)
{
    public IList<PartnerBlock>? Partners { get; set; }
}