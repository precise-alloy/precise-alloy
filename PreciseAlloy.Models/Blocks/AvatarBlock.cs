using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.Web;
using PreciseAlloy.Models.Interfaces;

namespace PreciseAlloy.Models.Blocks;

[ContentType(
    DisplayName = "Avatar Block",
    Description = "",
    GUID = "4c9c9654-6183-4f9f-b23a-0560bfdb9fb0")]
[ContentTypeIcon(FontAwesome.User)]
public class AvatarBlock
    : BaseBlockData, IChildBlock
{
    [Display(
        Name = "Name",
        Description = "",
        Order = 100)]
    public virtual string? Name { get; set; }

    [UIHint(UIHint.Image)]
    [Display(
        Name = "Image",
        Description = "",
        Order = 200)]
    public virtual ContentReference? Image { get; set; }

    [Display(
        Name = "Job Title",
        Description = "",
        GroupName = SystemTabNames.Content,
        Order = 300)]
    [CultureSpecific]
    public virtual string? JobTitle { get; set; }
}
