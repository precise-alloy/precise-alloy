using EPiServer;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using PreciseAlloy.Models.Constants;

namespace PreciseAlloy.Models.Blocks;

[ContentType(
    DisplayName = "Social Link Block",
    GroupName = TabNames.SiteSettings,
    GUID = "56174c38-7fb4-4734-96dd-9a7b13932ffe")]
[ContentTypeIcon(FontAwesome.Share)]
// ReSharper disable once UnusedMember.Global
public class SocialLinkBlock : BaseBlockData
{
    [Display(
        Name = "Url",
        Order = 100)]
    [CultureSpecific]
    public virtual Url? Url { get; set; }

    [Display(
        Name = "Icon",
        Order = 200)]
    public virtual string? Icon { get; set; }

    [Display(
        Name = "Icon Width",
        Order = 300)]
    public virtual int IconWidth { get; set; }

    [Display(
        Name = "Icon Height",
        Order = 400)]
    public virtual int IconHeight { get; set; }

    [Display(
        Name = "Alternative Text",
        Order = 500)]
    [CultureSpecific]
    public virtual string? AlternativeText { get; set; }

    [Display(
        Name = "Open in new tab",
        Order = 600)]
    public virtual bool OpenInNewTab { get; set; }

    public override void SetDefaultValues(ContentType contentType)
    {
        OpenInNewTab = true;
        base.SetDefaultValues(contentType);
    }
}
