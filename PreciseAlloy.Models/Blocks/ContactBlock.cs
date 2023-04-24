using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAnnotations;
using EPiServer.Web;

namespace PreciseAlloy.Models.Blocks;

[ContentType(DisplayName = "Contact block", Description = "Contact block", GUID = "DF23C879-B5D4-4147-95D6-EF87E73B17AB")]
public class ContactBlock : BaseBlockData
{
    [Display(Name = "Heading", Description = "Heading", Order = 100)]
    [CultureSpecific]
    public virtual string? Heading { get; set; }
    
    [CultureSpecific]
    [UIHint(UIHint.Textarea)]
    [Display(Name = "Description", Description = "Description", Order = 110)]
    public virtual string? Description { get; set; }

    [Display(Name = "Forms", Description = "Forms", Order = 120)]
    public virtual ContentArea? Forms { get; set; }

    [Display(Name = "Right image", Description = "Right image", Order = 130)]
    public virtual ContentReference? RightImage { get; set; }
}