using EPiServer.Core;

namespace PreciseAlloy.Models.Blocks.RichText;

[ContentType(
    DisplayName = "Rich Text Block",
    Description = "",
    GUID = "f8bd904c-5648-483b-99f5-a7f1cf78d9c1")]
[ContentTypeIcon(FontAwesome.Users)]
public class RichTextBlock
    : BaseBlockData
{
    [Display(
        Name = "Text",
        Order = 10)]
    [CultureSpecific]
    [Required]
    public virtual XhtmlString Text { get; set; } = null!;
}