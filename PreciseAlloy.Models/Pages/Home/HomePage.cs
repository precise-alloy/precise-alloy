using EPiServer.DataAnnotations;

namespace PreciseAlloy.Models.Pages.Home;

[ContentType(
    DisplayName = "Home Page",
    GUID = "d81ac9da-a438-4f5d-ac1f-4359e3b7b707",
    Description = "")]
[ContentTypeIcon(FontAwesome.Home)]
public class HomePage()
    : SitePageData("home")
{
}