using EPiServer.DataAnnotations;

namespace PreciseAlloy.Models.Settings;

[AttributeUsage(validOn: AttributeTargets.Class)]

public sealed class SettingsContentTypeAttribute
    : ContentTypeAttribute
{
    public string? SettingsName { get; set; }
}
