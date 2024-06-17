using EPiServer.DataAnnotations;
using EPiServer.Framework.DataAnnotations;

namespace PreciseAlloy.Models.Media;

[ContentType(
    GUID = "53DD025A-63A1-463A-B7B4-9C2634F14EF3",
    DisplayName = "PNG File",
    Description = "PNG media file type. Supports .png, .webp extension.")]
[MediaDescriptor(ExtensionString = "png,webp")]
[ContentTypeIcon(FontAwesome.FileImageO)]
// ReSharper disable once UnusedMember.Global
public class PngImageFile : ImageFile
{
}
