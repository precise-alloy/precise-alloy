using EPiServer.Core;
using EPiServer.DataAbstraction;
using PreciseAlloy.Models.Settings;

namespace PreciseAlloy.Services.Settings;

public partial class SettingsService
{
    private void ContentLanguageSettingSavedOrDeleted(
        object? sender,
        ContentLanguageSettingEventArgs? e)
    {
        if (sender == null
            || e == null)
        {
            return;
        }

        if (e.ContentLink == ContentReference.RootPage
            || _contentRepository.TryGet(e.ContentLink, out SettingsBase _))
        {
            ClearCache();
        }
    }
}
