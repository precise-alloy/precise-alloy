using System.ComponentModel.DataAnnotations;
using PreciseAlloy.Models.Blocks;
using PreciseAlloy.Models.Constants;
using PreciseAlloy.Models.Media;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.Web;

namespace PreciseAlloy.Models.Pages;

public abstract class SitePageData
    : PageData
{
    [Display(
        Name = "Main Content Area",
        GroupName = SystemTabNames.Content,
        Order = 10)]
    [AllowedTypes(typeof(BaseBlockData), typeof(PdfFile))]
    public virtual ContentArea MainContentArea { get; set; }

    [CultureSpecific]
    [Display(GroupName = TabNames.MetaData, Order = 1000)]
    public virtual string MetaTitle
    {
        get
        {
            var metaTitle = this.GetPropertyValue(p => p.MetaTitle);
            return !string.IsNullOrWhiteSpace(metaTitle) ? metaTitle : PageName;
        }

        set { this.SetPropertyValue(p => p.MetaTitle, value); }
    }

    [CultureSpecific]
    [UIHint(UIHint.Textarea)]
    [Display(GroupName = TabNames.MetaData, Order = 1010)]
    public virtual string MetaDescription { get; set; }

    [CultureSpecific]
    [UIHint(UIHint.Textarea)]
    [Display(GroupName = TabNames.MetaData, Order = 1020)]
    public virtual string MetaKeywords { get; set; }

    [CultureSpecific]
    [Display(GroupName = TabNames.MetaData, Order = 1030)]
    public virtual ContentReference CanonicalLinkOverride { get; set; }

    [CultureSpecific]
    [Display(GroupName = TabNames.MetaData, Order = 1040)]
    public virtual bool DisableIndexing { get; set; }

    [CultureSpecific]
    [Display(GroupName = TabNames.MetaData, Order = 1050)]
    public virtual bool DisableFollow { get; set; }

    [CultureSpecific]
    [UIHint(UIHint.Image)]
    [Display(GroupName = TabNames.MetaData, Order = 1060)]
    public virtual ContentReference SocialMediaImage { get; set; }

    [CultureSpecific]
    [Display(GroupName = TabNames.Settings, Order = 1070)]
    public virtual bool HideSiteHeader { get; set; }

    [CultureSpecific]
    [Display(GroupName = TabNames.Settings, Order = 1080)]
    public virtual bool HideSiteFooter { get; set; }
}
