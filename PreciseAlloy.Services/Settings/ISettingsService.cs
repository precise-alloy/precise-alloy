using EPiServer.Applications;
using EPiServer.Core;
using PreciseAlloy.Models.Settings;

namespace PreciseAlloy.Services.Settings;

public interface ISettingsService
{
    ContentReference? GlobalSettingsRoot { get; }
    void InitializeSettings();
    T? GetSiteSettings<T>(string? siteId = null, string? language = null) where T : SettingsBase;
    void SiteCreated(object? sender, ApplicationCreatedEvent e);
    void SiteDeleted(object? sender, ApplicationDeletedEvent e);
    void SiteUpdated(object? sender, ApplicationUpdatedEvent e);
}
