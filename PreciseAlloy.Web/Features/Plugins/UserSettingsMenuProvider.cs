using EPiServer.Shell.Navigation;

namespace PreciseAlloy.Web.Features.Plugins;

[MenuProvider]
// ReSharper disable once UnusedMember.Global
public class UserSettingsMenuProvider
    : BaseMenuProvider
{
    public override IEnumerable<MenuItem> GetMenuItems()
    {
        var menuItems = new List<MenuItem>
        {
            new UrlMenuItem(
                "Documentation",
                MenuPaths.User + "/episerver2",
                "https://world.episerver.com/documentation/")
            {
                IsAvailable = _ => true,
                SortIndex = SortIndex.Last + 10
            }
        };
        return menuItems;
    }
}
