using EPiServer.Core;
using EPiServer.DataAccess;
using EPiServer.Security;
using EPiServer.Web;
using Microsoft.Extensions.Logging;
using PreciseAlloy.Models.Settings;

namespace PreciseAlloy.Services.Settings;

public partial class SettingsService
{
    private Guid ResolveSiteId()
    {
        var request = _httpContextAccessor.HttpContext?.Request;
        if (request == null)
        {
            return SiteDefinition.Current.Id;
        }

        var site = _siteDefinitionResolver.GetByHostname(request.Host.Host, true);
        return site?.Id ?? SiteDefinition.Current.Id;
    }

    private void SiteCreated(
        object? sender,
        SiteDefinitionEventArgs e)
    {
        if (sender == null)
        {
            return;
        }

        if (!_contentLoader
                .GetChildren<SettingsFolder>(GlobalSettingsRoot)
                .Any(x => x.Name.Equals(e.Site.Name, StringComparison.InvariantCultureIgnoreCase)))
        {
            CreateSiteFolder(e.Site);
        }
    }

    private void SiteDeleted(
        object? sender,
        SiteDefinitionEventArgs e)
    {
        if (sender == null)
        {
            return;
        }

        var folder = _contentLoader
            .GetChildren<SettingsFolder>(GlobalSettingsRoot)
            .FirstOrDefault(x => x.Name.Equals(e.Site.Name, StringComparison.InvariantCultureIgnoreCase));

        if (folder == null)
        {
            return;
        }

        _contentLoader.Delete(folder.ContentLink, true, AccessLevel.NoAccess);
        ClearCache();
    }

    private void SiteUpdated(
        object? sender,
        SiteDefinitionEventArgs e)
    {
        if (sender == null)
        {
            return;
        }

        if (e is not SiteDefinitionUpdatedEventArgs updatedArgs)
        {
            _logger.LogError("SiteUpdated fail as SiteDefinitionEventArgs is not of type SiteDefinitionUpdatedEventArgs");
            return;
        }

        var prevSite = updatedArgs.PreviousSite;
        var updatedSite = updatedArgs.Site;
        var settingsRoot = GlobalSettingsRoot;

        if (_contentLoader
                .GetChildren<IContent>(settingsRoot)
                .FirstOrDefault(x => x.Name.Equals(prevSite.Name, StringComparison.InvariantCultureIgnoreCase)) is ContentFolder currentSettingsFolder)
        {
            var cloneFolder = currentSettingsFolder.CreateWritableClone();
            cloneFolder.Name = updatedSite.Name;
            _contentLoader.Save(cloneFolder, SaveAction.Publish, AccessLevel.NoAccess);
        }
        else
        {
            CreateSiteFolder(e.Site);
        }
    }
}
