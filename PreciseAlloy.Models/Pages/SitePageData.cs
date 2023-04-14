using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.Web;
using PreciseAlloy.Models.Blocks;
using PreciseAlloy.Models.Constants;
using PreciseAlloy.Models.Media;
// ReSharper disable UnusedMember.Global

namespace PreciseAlloy.Models.Pages;

public abstract class SitePageData
    : PageData
{
    [Display(
        Name = "Main Content Area",
        GroupName = SystemTabNames.Content,
        Order = 10)]
    [AllowedTypes(typeof(BaseBlockData), typeof(PdfFile))]
    public virtual ContentArea? MainContentArea { get; set; }

    #region Metadata
    [CultureSpecific]
    [Display(
        Name = "Meta Title",
        GroupName = TabNames.MetaData,
        Order = 1000)]
    public virtual string MetaTitle
    {
        get
        {
            var metaTitle = this.GetPropertyValue(p => p.MetaTitle);
            return !string.IsNullOrWhiteSpace(metaTitle) ? metaTitle : PageName;
        }

        set
        {
            this.SetPropertyValue(p => p.MetaTitle, value);
        }
    }

    [CultureSpecific]
    [UIHint(UIHint.Textarea)]
    [Display(
        Name = "Meta Description",
        GroupName = TabNames.MetaData,
        Order = 1010)]
    public virtual string? MetaDescription { get; set; }

    [CultureSpecific]
    [UIHint(UIHint.Textarea)]
    [Display(
        Name = "Meta Keywords",
        GroupName = TabNames.MetaData,
        Order = 1020)]
    public virtual string? MetaKeywords { get; set; }

    [CultureSpecific]
    [Display(
        Name = "Canonical Link Override",
        GroupName = TabNames.MetaData,
        Order = 1030)]
    public virtual ContentReference? CanonicalLinkOverride { get; set; }

    [CultureSpecific]
    [Display(
        Name = "Disable Indexing",
        GroupName = TabNames.MetaData,
        Order = 1040)]
    public virtual bool DisableIndexing { get; set; }

    [CultureSpecific]
    [Display(
        Name = "Disable Follow",
        GroupName = TabNames.MetaData,
        Order = 1050)]
    public virtual bool DisableFollow { get; set; }

    [CultureSpecific]
    [UIHint(UIHint.Image)]
    [Display(
        Name = "Social Media Image",
        GroupName = TabNames.MetaData,
        Order = 1060)]
    public virtual ContentReference? SocialMediaImage { get; set; }
    #endregion

    [CultureSpecific]
    [Display(
        Name = "Hide Site Header",
        GroupName = TabNames.Settings,
        Order = 1070)]
    public virtual bool HideSiteHeader { get; set; }

    [CultureSpecific]
    [Display(
        Name = "Hide Site Footer",
        GroupName = TabNames.Settings,
        Order = 1080)]
    public virtual bool HideSiteFooter { get; set; }
}
