using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.SpecializedProperties;
using EPiServer.Web;
using PreciseAlloy.Models.Constants;
using PreciseAlloy.Models.Pages;

namespace PreciseAlloy.Models.Settings;

[SettingsContentType(
    DisplayName = "Layout Settings",
    Description = "",
    GUID = "eb7c042f-121f-464e-968a-6a433b45dc5f")]
public class LayoutSettings : SettingsBase
{
    [UIHint(UIHint.Image)]
    [CultureSpecific]
    [Display(
        Name = "")]
    public virtual ContentReference? SocialShareImageUrl { get; set; }

    [Display(
        Name = "Company Name",
        GroupName = TabNames.Header,
        Order = 100)]
    [CultureSpecific]
    public virtual string? CompanyName { get; set; }

    [Display(
        Name = "Logo URL",
        GroupName = TabNames.Header,
        Order = 200)]
    [AllowedTypes(typeof(SitePageData))]
    public virtual ContentReference? HeaderLogoUrl { get; set; }

    [Display(
        Name = "Logo Alternative Text",
        GroupName = TabNames.Header,
        Order = 300)]
    [CultureSpecific]
    public virtual string? HeaderLogoAlternativeText { get; set; }

    [Display(
        Name = "Header Menu",
        GroupName = TabNames.Header,
        Order = 400)]
    public virtual LinkItemCollection? HeaderMenu { get; set; }
}
