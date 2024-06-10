using EPiServer.DataAnnotations;
using PreciseAlloy.Models.Interfaces;

namespace PreciseAlloy.Models.Blocks;

[ContentType(
    DisplayName = "Partners Block",
    Description = "",
    GUID = "d52552a4-9e55-4da8-bdc8-871741f1e27d")]
public class PartnersBlock
    : BaseBlockData, IHasHeading, IHasSubHeading
{
    [Display(
        Name = "Sub-Heading",
        Order = 100)]
    [CultureSpecific]
    public virtual string? SubHeading { get; set; }

    [Display(
        Name = "Heading",
        Order = 200)]
    [CultureSpecific]
    public virtual string? Heading { get; set; }
}
