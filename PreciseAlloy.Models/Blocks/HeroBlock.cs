using EPiServer;
using EPiServer.Core;
using EPiServer.DataAnnotations;
using EPiServer.Web;
using PreciseAlloy.Models.Interfaces;

namespace PreciseAlloy.Models.Blocks;

[ContentType(
    DisplayName = "Hero Block",
    Description = "",
    GUID = "3b6e8aca-a9ff-4e06-b136-ecc10d40faa0")]
[ContentTypeIcon(FontAwesome.Header)]
public class HeroBlock
    : BaseBlockData, IHasHeading, IHasSubHeading
{
    [Display(
        Name = "Sub Heading",
        Order = 100)]
    [CultureSpecific]
    public virtual string? SubHeading { get; set; }

    [Display(
        Name = "Heading",
        Order = 200)]
    [CultureSpecific]
    public virtual string? Heading { get; set; }

    [Display(
        Name = "Text",
        Order = 300)]
    [CultureSpecific]
    public virtual XhtmlString? Text { get; set; }

    [Display(
        Name = "CTA URL",
        Order = 400)]
    [CultureSpecific]
    public virtual Url? CtaUrl { get; set; }

    [Display(
        Name = "CTA Text",
        Order = 500)]
    [CultureSpecific]
    public virtual string? CtaText { get; set; }

    [Display(
        Name = "Image",
        Order = 600)]
    [CultureSpecific]
    [UIHint(UIHint.Image)]
    public virtual ContentReference? Image { get; set; }

    [Display(
        Name = "Image Alternative Text",
        Order = 700)]
    [CultureSpecific]
    public virtual string? ImageAlternativeText { get; set; }
}
