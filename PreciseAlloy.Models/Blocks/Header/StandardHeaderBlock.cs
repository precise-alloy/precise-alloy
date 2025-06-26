using EPiServer.Core;
using EPiServer.DataAnnotations;
using EPiServer.SpecializedProperties;
using EPiServer.Web;
using PreciseAlloy.Models.Pages;

namespace PreciseAlloy.Models.Blocks.Header;

[ContentType(
    DisplayName = "Standard Header Block",
    Description = "Standard Header Block",
    GUID = "b921a1c2-82ef-4d95-bc59-dfa54d1c691a")]
[ContentTypeIcon(FontAwesome.Header)]
public class StandardHeaderBlock
    : BaseHeaderBlock
{
    [Display(
        Name = "Company Name",
        Order = 100)]
    [CultureSpecific]
    public virtual string? CompanyName { get; set; }

    [Display(
        Name = "Logo Image",
        Order = 150)]
    [UIHint(UIHint.Image)]
    public virtual ContentReference? LogoImage { get; set; }

    [Display(
        Name = "Logo URL",
        Order = 200)]
    [AllowedTypes(typeof(SitePageData))]
    public virtual ContentReference? LogoUrl { get; set; }

    [Display(
        Name = "Logo Alternative Text",
        Order = 300)]
    [CultureSpecific]
    public virtual string? HeaderLogoAlternativeText { get; set; }

    [Display(
        Name = "Header Menu",
        Order = 400)]
    public virtual LinkItemCollection? HeaderMenu { get; set; }
}