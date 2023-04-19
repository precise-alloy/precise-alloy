using EPiServer.SpecializedProperties;

namespace PreciseAlloy.Web.Features.ViewComponents.Header;

public class HeaderViewModel
{
    public string? CompanyName { get; set; }
    public string? LogoUrl { get; set; }
    public string? LogoAlternativeText { get; set; }
    public LinkItemCollection? Menu { get; set; }
}
