using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using System.ComponentModel.DataAnnotations;

namespace PreciseAlloy.Models.Blocks;

[ContentType(
    DisplayName = "People Block",
    Description = "",
    GUID = "2f5cb180-6c82-49be-bfc7-80b013c23099")]
public class PeopleBlock
    : BaseBlockData
{
    [Display(
        Name = "Sub-Header",
        Description = "",
        GroupName = SystemTabNames.Content,
        Order = 100)]
    [CultureSpecific]
    public virtual string? SubHeader { get; set; }

    [Display(
        Name = "Header",
        Description = "",
        GroupName = SystemTabNames.Content,
        Order = 200)]
    [CultureSpecific]
    public virtual string? Header { get; set; }

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
