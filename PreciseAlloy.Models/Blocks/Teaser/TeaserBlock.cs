using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.SpecializedProperties;
using EPiServer.Web;
using PreciseAlloy.Models.Interfaces;

namespace PreciseAlloy.Models.Blocks.Teaser;

[ContentType(
    DisplayName = "Teaser Block",
    Description = "",
    GUID = "e8dcda7f-54d7-4a8c-95ad-51ab3c41a45a")]
[ContentTypeIcon(FontAwesome.Header)]
public class TeaserBlock
    : BaseBlockData, IHasHeading
{
    [Display(
        Name = "Heading",
        Description = "",
        GroupName = SystemTabNames.Content,
        Order = 100)]
    [CultureSpecific]
    public virtual string? Heading { get; set; }

    [Display(
        Name = "Text",
        Description = "",
        GroupName = SystemTabNames.Content,
        Order = 200)]
    [CultureSpecific]
    public virtual XhtmlString? Text { get; set; }

    [Display(
        Name = "Image",
        Description = "",
        GroupName = SystemTabNames.Content,
        Order = 300)]
    [UIHint(UIHint.Image)]
    [CultureSpecific]
    public virtual ContentReference? Image { get; set; }

    [Display(
        Name = "Show Image On The Right",
        Description = "",
        GroupName = SystemTabNames.Content,
        Order = 400)]
    public virtual bool ShowImageOnTheRight { get; set; }

    [Display(
        Name = "Cta Button",
        Description = "",
        GroupName = SystemTabNames.Content,
        Order = 500)]
    public virtual LinkItem? CtaButton { get; set; }
}