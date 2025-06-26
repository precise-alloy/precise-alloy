using EPiServer.SpecializedProperties;

namespace PreciseAlloy.Models.Blocks.Header;

public class StandardHeaderViewModel
{
    public string? CompanyName { get; set; }
    public string? LogoSrc { get; set; }
    public string? LogoUrl { get; set; }
    public string? LogoAlternativeText { get; set; }
    public LinkItemCollection? Menu { get; set; }
}