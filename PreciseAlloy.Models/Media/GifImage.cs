using EPiServer.DataAnnotations;
using EPiServer.Framework.DataAnnotations;

namespace PreciseAlloy.Models.Media
{
    [ContentType(
        GUID = "5A8960AE-75DA-426C-9002-1859E57AE882",
        DisplayName = "GIF File",
        Description = "")]
    [MediaDescriptor(ExtensionString = "gif")]
    public class GifImageFile : ImageFile
    {
    }
}