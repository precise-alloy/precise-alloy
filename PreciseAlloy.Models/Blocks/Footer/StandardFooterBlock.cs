using EPiServer.Core;
using EPiServer.DataAnnotations;
using PreciseAlloy.Models.Blocks.SocialLink;
using PreciseAlloy.Models.Constants;

namespace PreciseAlloy.Models.Blocks.Footer;

[ContentType(
    DisplayName = "Standard Footer Block",
    Description = "Standard Footer Block",
    GUID = "2a8f4551-c963-4e82-b0b5-b2e2b8b36f53")]
[ContentTypeIcon(FontAwesome.Header)]
public class StandardFooterBlock
    : BaseFooterBlock
{
    [AllowedTypes(typeof(SocialLinkBlock))]
    [Display(
        Name = "Social Links",
        GroupName = TabNames.Footer,
        Order = 100)]
    public virtual ContentArea? SocialLinks { get; set; }

    [Display(
        Name = "Copyright Text",
        GroupName = TabNames.Footer,
        Order = 200)]
    [CultureSpecific]
    public virtual string? CopyrightText { get; set; }
}