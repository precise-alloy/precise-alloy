using EPiServer.Framework.DataAnnotations;

namespace PreciseAlloy.Models.Media;

[ContentType(
    GUID = "0A89E464-56D4-449F-AEA8-2BF774AB8730",
    DisplayName = "JPEG File",
    Description = "JPEG media file type. Supports .jpg, .jpeg extension.")]
[MediaDescriptor(ExtensionString = "jpg,jpeg")]
[ContentTypeIcon(FontAwesome.FileImageO)]
// ReSharper disable once UnusedMember.Global
public class JpegImageFile
    : ImageFile
{
}