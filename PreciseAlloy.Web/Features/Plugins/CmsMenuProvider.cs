using EPiServer.Authorization;
using EPiServer.Shell.Modules;
using EPiServer.Shell.Navigation;

namespace PreciseAlloy.Web.Features.Plugins;

[MenuProvider]
public class CmsMenuProvider : IMenuProvider
{
    private readonly ModuleTable _modules;

    public CmsMenuProvider(ModuleTable modules)
    {
        _modules = modules;
    }

    public IEnumerable<MenuItem> GetMenuItems()
    {
        var menuItems = new List<MenuItem>
        {
            new UrlMenuItem(
                "Another link to Admin",
                MenuPaths.Global + "/cms" + "/cmsMenuItem",
                Path.Combine(_modules.FindModule("EPiServer.CMS.UI.Admin").ResourceBasePath, "default"))
            {
                SortIndex = SortIndex.First + 25,
                AuthorizationPolicy = CmsPolicyNames.CmsAdmin
            }
        };

        return menuItems;
    }
}
