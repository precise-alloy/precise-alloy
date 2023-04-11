using Microsoft.Extensions.Logging;
using PreciseAlloy.Models.Settings;
using PreciseAlloy.Utils.Extensions;

namespace PreciseAlloy.Services.Settings;

public class SettingsService
    : ISettingsService
{
    private readonly ILogger<SettingsService> _logger;

    public SettingsService(ILogger<SettingsService> logger)
    {
        _logger = logger;
        _logger.EnterConstructor();
        _logger.ExitConstructor();
    }

    public LayoutSettings? GetLayoutSettings()
    {
        try
        {
            var layoutSettings = new LayoutSettings();

            return layoutSettings;
        }
        catch (Exception ex)
        {
            _logger.LogError("Cannot get layout settings");
            return null;
        }
    }
}
