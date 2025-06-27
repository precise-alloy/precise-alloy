using EPiServer;
using PreciseAlloy.Models.Interfaces;

namespace PreciseAlloy.Models.Blocks.Button;

[ContentType(
    DisplayName = "Button Block",
    GUID = "30906de0-0907-4dad-835e-59c2116501b9")]
[ContentTypeIcon(FontAwesome.Navicon)]
public class ButtonBlock
    : BaseBlockData, IChildBlock
{
    [Display(
        Name = "Text",
        Order = 100)]
    [CultureSpecific]
    public virtual string? Text { get; set; }

    [Display(
        Name = "URL",
        Order = 200)]
    [CultureSpecific]
    public virtual Url? Url { get; set; }

    [Display(
        Name = "Open in new tab",
        Order = 300)]
    public virtual bool OpenInNewTab { get; set; }
}