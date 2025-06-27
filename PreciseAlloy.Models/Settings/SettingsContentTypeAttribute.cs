using PreciseAlloy.Models.Constants;

namespace PreciseAlloy.Models.Settings;

[AttributeUsage(AttributeTargets.Class)]
public sealed class SettingsContentTypeAttribute
    : ContentTypeAttribute
{
    public SettingsContentTypeAttribute()
    {
        Description = string.Empty;
        GroupName = TabNames.SiteSettings;
    }
}