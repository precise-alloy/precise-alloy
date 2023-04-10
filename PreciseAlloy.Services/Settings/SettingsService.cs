using PreciseAlloy.Models.Settings;

namespace PreciseAlloy.Services.Settings;

public class SettingsService
    : ISettingsService
{
    public LayoutSettings GetLayoutSettings()
    {
        var layoutSettings = new LayoutSettings();
        return layoutSettings;
    }
}
