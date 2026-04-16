using EPiServer.Authorization;
using EPiServer.Shell.Modules;
using EPiServer.Shell.Navigation;

namespace PreciseAlloy.Web.Features.Plugins;

[MenuProvider]
// ReSharper disable once UnusedMember.Global
public class CmsMenuProvider(
    ModuleTable modules)
    : BaseMenuProvider
{
    private const string AdminModuleName = "EPiServer.Cms.UI.Admin";

    public override IEnumerable<MenuItem> GetMenuItems()
    {
        var adminModule = modules.FindModule(AdminModuleName);
        if (adminModule == null || string.IsNullOrWhiteSpace(adminModule.ResourceBasePath))
        {
            return [];
        }

        var menuItems = new List<MenuItem>
        {
            new UrlMenuItem(
                "Another link to Admin",
                MenuPaths.Global + "/cms" + "/cmsMenuItem",
                Path.Combine(adminModule.ResourceBasePath, "default"))
            {
                IsAvailable = HasAdminRole,
                SortIndex = SortIndex.First + 25,
                AuthorizationPolicy = CmsPolicyNames.CmsAdmin
            }
        };

        return menuItems;
    }
}
