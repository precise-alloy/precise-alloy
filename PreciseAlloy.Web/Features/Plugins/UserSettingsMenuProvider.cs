using EPiServer.Shell.Navigation;

namespace PreciseAlloy.Web.Features.Plugins;

[MenuProvider]
public class UserSettingsMenuProvider : IMenuProvider
{
    public IEnumerable<MenuItem> GetMenuItems()
    {
        var menuItems = new List<MenuItem>
        {
            new UrlMenuItem(
                "Documentation",
                MenuPaths.User + "/episerver2",
                "https://world.episerver.com/documentation/")
            {
                SortIndex = SortIndex.Last + 10
            }
        };
        return menuItems;
    }
}
