using EPiServer.Core;
using EPiServer.DataAnnotations;
using EPiServer.Web;
using PreciseAlloy.Models.Interfaces;

namespace PreciseAlloy.Models.Blocks;

[ContentType(
    DisplayName = "Partner Block",
    Description = "",
    GUID = "9b74bc36-9346-4e67-a529-1b443bf1367b")]
[ContentTypeIcon(FontAwesome.User)]
public class PartnerBlock
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
        Name = "Image",
        Order = 300)]
    [CultureSpecific]
    [Required]
    [UIHint(UIHint.Image)]
    public virtual ContentReference Image { get; set; } = null!;
}
