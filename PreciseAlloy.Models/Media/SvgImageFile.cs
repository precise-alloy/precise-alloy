using EPiServer.DataAnnotations;
using EPiServer.Framework.DataAnnotations;

namespace PreciseAlloy.Models.Media;

[ContentType(
    GUID = "C3E2D38D-CA7A-41DF-AB4B-D7FE40600C8A",
    DisplayName = "SVG File",
    Description = "")]
[MediaDescriptor(ExtensionString = "svg")]
// ReSharper disable once UnusedMember.Global
public class SvgImageFile : ImageFile
{
}
