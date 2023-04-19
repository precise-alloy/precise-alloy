using EPiServer.DataAnnotations;
using PreciseAlloy.Models.Interfaces;

namespace PreciseAlloy.Models.Blocks;

[ContentType(
    DisplayName = "Partner Block",
    Description = "",
    GUID = "d52552a4-9e55-4da8-bdc8-871741f1e27d")]
public class PartnerBlock
    : BaseBlockData, IHasHeading, IHasSubHeading
{
    public virtual string? Heading { get; set; }
    public virtual string? SubHeading { get; set; }
}
