using EPiServer.Web;
using PreciseAlloy.Models.Constants;

namespace PreciseAlloy.Models.Settings;

[SettingsContentType(
    DisplayName = "SEO Settings",
    Description = "",
    GUID = "3217aa51-e3c8-4c2b-8106-00d57e44221e")]
[ContentTypeIcon(FontAwesome.Search)]
public class SeoSettings
    : SettingsBase
{
    // Do not set CultureSpecific attribute for this property
    [UIHint(UIHint.Textarea)]
    [Display(
        Name = "Robots TXT content",
        GroupName = TabNames.SiteMetaData,
        Order = 200)]
    public virtual string? RobotsTxtContent { get; set; }
}
