using PreciseAlloy.Models.Settings;

namespace PreciseAlloy.Services.Settings;

public interface ISettingsService
{
    LayoutSettings? GetLayoutSettings();
}
