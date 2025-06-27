using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.Shell.ObjectEditing;
using EPiServer.Web;
using PreciseAlloy.Models.Blocks.Footer;
using PreciseAlloy.Models.Blocks.Header;
using PreciseAlloy.Models.Constants;
using PreciseAlloy.Models.Factories;
using PreciseAlloy.Models.Pages.NotFound;

namespace PreciseAlloy.Models.Settings;

[SettingsContentType(
    DisplayName = "Layout Settings",
    Description = "",
    GUID = "eb7c042f-121f-464e-968a-6a433b45dc5f")]
[ContentTypeIcon(FontAwesome.Gears)]
public class LayoutSettings
    : SettingsBase
{
    #region Content

    [Display(
        Name = "Layout Type")]
    [SelectOne(SelectionFactoryType = typeof(LayoutTypeSelectionFactory))]
    public virtual string? LayoutType { get; set; }

    #endregion

    #region Metadata

    [UIHint(UIHint.Image)]
    [CultureSpecific]
    [Display(
        Name = "Social Share Image URL",
        GroupName = TabNames.SiteMetaData,
        Order = 100)]
    public virtual ContentReference? SocialShareImageUrl { get; set; }

    #endregion

    #region Header

    [Display(
        Name = "Header",
        GroupName = TabNames.Header,
        Order = 100)]
    [AllowedTypes(typeof(BaseHeaderBlock))]
    [CultureSpecific]
    public virtual ContentReference? Header { get; set; }

    #endregion Header

    #region Footer

    [Display(
        Name = "Footer",
        GroupName = TabNames.Footer,
        Order = 100)]
    [AllowedTypes(typeof(BaseFooterBlock))]
    [CultureSpecific]
    public virtual ContentReference? Footer { get; set; }

    #endregion

    #region References

    [Display(
        Name = "Not Found page",
        GroupName = TabNames.ContentReferences,
        Order = 20)]
    [AllowedTypes(typeof(NotFoundPage))]
    [CultureSpecific]
    public virtual ContentReference? NotFound { get; set; }

    #endregion

    public override void SetDefaultValues(ContentType contentType)
    {
        base.SetDefaultValues(contentType);

        LayoutType = LayoutTypes.Default;
    }
}