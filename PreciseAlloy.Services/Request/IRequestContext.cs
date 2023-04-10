using EPiServer.Core;
using PreciseAlloy.Models.Settings;

namespace PreciseAlloy.Services.Request;

public interface IRequestContext
{
    PageData? CurrentPage();

    LayoutSettings? GetLayoutSettings();

    void SetPageSubstitute(PageData page);
}
