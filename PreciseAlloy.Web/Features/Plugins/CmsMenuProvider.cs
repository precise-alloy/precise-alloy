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
    public override IEnumerable<MenuItem> GetMenuItems()
    {
        var menuItems = new List<MenuItem>
        {
            new UrlMenuItem(
                "Another link to Admin",
                MenuPaths.Global + "/cms" + "/cmsMenuItem",
                Path.Combine(modules.FindModule("EPiServer.CMS.UI.Admin").ResourceBasePath, "default"))
            {
                IsAvailable = HasAdminRole,
                SortIndex = SortIndex.First + 25,
                AuthorizationPolicy = CmsPolicyNames.CmsAdmin
            }
        };

        return menuItems;
    }
}
