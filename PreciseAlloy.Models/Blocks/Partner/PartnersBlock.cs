using EPiServer.Core;
using EPiServer.DataAnnotations;
using PreciseAlloy.Models.Interfaces;

namespace PreciseAlloy.Models.Blocks.Partner;

[ContentType(
    DisplayName = "Partners Block",
    Description = "",
    GUID = "d52552a4-9e55-4da8-bdc8-871741f1e27d")]
[ContentTypeIcon(FontAwesome.Users)]
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

    [Display(
        Name = "Description",
        Order = 300)]
    [CultureSpecific]
    public virtual XhtmlString? Description { get; set; }

    [Display(
        Name = "Partners",
        Order = 400)]
    [CultureSpecific]
    [Required]
    public virtual ContentArea Partners { get; set; } = null!;
}