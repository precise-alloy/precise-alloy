using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.Framework.Localization;
using EPiServer.ServiceLocation;

namespace PreciseAlloy.Models.Settings;

[ContentType(
    DisplayName = "Settings Folder",
    GUID = "c709627f-ca9f-4c77-b0fb-8563287ebd93")]
[AvailableContentTypes(Include = [typeof(SettingsBase), typeof(SettingsFolder)])]
[ContentTypeIcon(FontAwesome.Folder)]
public class SettingsFolder
    : ContentFolder
{
    public const string SettingsRootName = "SettingsRoot";
    public static readonly Guid SettingsRootGuid = new("79611ee5-7ddd-4ac8-b00e-5e8e8d2a57ee");

    private Injected<LocalizationService> _localizationService;
    private static Injected<ContentRootService> _rootService;

    public static ContentReference SettingsRoot => GetSettingsRoot();

    public override string Name
    {
        get => ContentLink.CompareToIgnoreWorkID(SettingsRoot)
            ? _localizationService.Service.GetString("/contentrepositories/globalsettings/Name", "Site Settings")
            : base.Name;

        set => base.Name = value;
    }

    private static ContentReference GetSettingsRoot() => _rootService.Service.Get(SettingsRootName);
}
