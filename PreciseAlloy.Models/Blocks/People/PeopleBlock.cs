using EPiServer.Core;
using EPiServer.DataAbstraction;
using PreciseAlloy.Models.Blocks.Avatar;
using PreciseAlloy.Models.Interfaces;

namespace PreciseAlloy.Models.Blocks.People;

[ContentType(
    DisplayName = "People Block",
    Description = "",
    GUID = "2f5cb180-6c82-49be-bfc7-80b013c23099")]
[ContentTypeIcon(FontAwesome.Users)]
public class PeopleBlock
    : BaseBlockData, IHasHeading, IHasSubHeading
{
    [Display(
        Name = "Sub-Heading",
        Description = "",
        GroupName = SystemTabNames.Content,
        Order = 100)]
    [CultureSpecific]
    public virtual string? SubHeading { get; set; }

    [Display(
        Name = "Heading",
        Description = "",
        GroupName = SystemTabNames.Content,
        Order = 200)]
    [CultureSpecific]
    public virtual string? Heading { get; set; }

    [Display(
        Name = "Text",
        Description = "",
        GroupName = SystemTabNames.Content,
        Order = 300)]
    [CultureSpecific]
    public virtual XhtmlString? Text { get; set; }

    [Display(
        Name = "Items",
        Description = "",
        GroupName = SystemTabNames.Content,
        Order = 400)]
    [AllowedTypes(typeof(AvatarBlock))]
    public virtual ContentArea? Items { get; set; }
}