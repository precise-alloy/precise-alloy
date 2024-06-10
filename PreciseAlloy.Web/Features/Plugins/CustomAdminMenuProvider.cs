using EPiServer.Shell.Navigation;

namespace PreciseAlloy.Web.Features.Plugins;

[MenuProvider]
// ReSharper disable once UnusedMember.Global
public class CustomAdminMenuProvider
    : BaseMenuProvider
{
    public override IEnumerable<MenuItem> GetMenuItems()
    {
        var urlMenuItem = new UrlMenuItem(
            "Extended Admin Page",
            "/global/cms/admin/import-users",
            "/ExtendedAdmin/Index")
        {
            IsAvailable = HasAdminRole,
            SortIndex = 100
        };

        return
        [
            urlMenuItem
        ];
    }
}