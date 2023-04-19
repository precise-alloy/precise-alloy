using EPiServer.Core;
using PreciseAlloy.Models.Settings;

namespace PreciseAlloy.Services.Settings;

public interface ISettingsService
{
    ContentReference? GlobalSettingsRoot { get; }
    void InitializeSettings();
    T? GetSiteSettings<T>(Guid? siteId = null, string? language = null) where T : SettingsBase;
}
