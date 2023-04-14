using EPiServer;
using EPiServer.Cms.Shell;
using EPiServer.Core;
using EPiServer.Web;
using PreciseAlloy.Models.Settings;

namespace PreciseAlloy.Services.Settings;

public partial class SettingsService
{
    private void SavedContent(
        object? sender,
        ContentEventArgs? e)
    {
        if (sender == null)
        {
            return;
        }

        if (e?.Content is not SettingsBase settings)
        {
            return;
        }

        var id = ResolveSiteId();
        if (id == Guid.Empty)
        {
            return;
        }

        //Only need to update one cached draft settings when saving content (draft)
        //Only update locally since save happens very often and don't really need to update draft change on other server in CDN
        var type = settings.GetOriginalType();
        var settingsOfType = GetSettingFromCache(id, type, true);
        settingsOfType[settings.LanguageBranch()] = settings;
        InsertSettingToCache(id, type, true, settingsOfType);
    }

    private void PublishedContent(
        object? sender,
        ContentEventArgs? e)
    {
        if (sender == null)
        {
            return;
        }

        if (e?.Content is not SettingsBase settings)
        {
            return;
        }

        var parent = _contentLoader.Get<IContent>(e.Content.ParentLink);
        var site = _siteDefinitionRepository.Get(parent.Name);

        var id = site?.Id;
        if (id == null || id == Guid.Empty)
        {
            return;
        }

        //Repopulate for all language: master lang update => other cached read from master will need to be changed,
        //fall back language change might lead to dependent language contents change
        //Also cached draft settings might need to be changed
        // So just to be safe, just repopulate everything, instead of checking for every possible cases above
        RemoveCache(id.Value, settings);
    }

    private void DeletedContentLanguage(
        object? sender,
        ContentEventArgs? e)
    {
        if (sender == null)
        {
            return;
        }

        if (e?.Content is not SettingsBase settings)
        {
            return;
        }

        var parent = _contentLoader.Get<IContent>(e.Content.ParentLink);
        var site = _siteDefinitionRepository.Get(parent.Name);

        var id = site?.Id;
        if (id == null || id == Guid.Empty)
        {
            return;
        }

        RemoveCache(id.Value, settings);
    }

    private void MovedContent(
        object? sender,
        ContentEventArgs? e)
    {
        if (sender == null)
        {
            return;
        }

        if (e?.Content is SettingsBase)
        {
            ClearCache(); //apply to move to other folder to wastebasket
        }
    }
}
