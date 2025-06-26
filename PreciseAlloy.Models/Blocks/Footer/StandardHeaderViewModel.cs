using PreciseAlloy.Models.Blocks.SocialLink;

namespace PreciseAlloy.Models.Blocks.Footer;

public class StandardFooterViewModel
{
    public IEnumerable<SocialLinkBlock>? SocialLinks { get; set; }
    public string? CopyrightText { get; set; }
}