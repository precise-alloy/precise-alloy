using EPiServer.DataAnnotations;
using PreciseAlloy.Models.Constants;

namespace PreciseAlloy.Models.Settings;

[AttributeUsage(validOn: AttributeTargets.Class)]

public sealed class SettingsContentTypeAttribute
    : ContentTypeAttribute
{
    public SettingsContentTypeAttribute()
    {
        Description = string.Empty;
        GroupName = TabNames.SiteSettings;
    }
}
