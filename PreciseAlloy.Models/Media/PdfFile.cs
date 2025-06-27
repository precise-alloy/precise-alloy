using EPiServer.Framework.DataAnnotations;

namespace PreciseAlloy.Models.Media;

[ContentType(
    GUID = "1BAE5D6F-93B7-4792-9CF4-2B582E2932EC",
    DisplayName = "PDF File",
    Description = "")]
[MediaDescriptor(ExtensionString = "pdf")]
[ContentTypeIcon(FontAwesome.FilePdfO)]
public class PdfFile : GenericMedia
{
}