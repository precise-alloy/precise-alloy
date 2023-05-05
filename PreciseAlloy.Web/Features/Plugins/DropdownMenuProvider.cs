using EPiServer.Shell.Navigation;

namespace PreciseAlloy.Web.Features.Plugins;

[MenuProvider]
public class DropdownMenuProvider : IMenuProvider
{
    const string DropdownMenuPath = MenuPaths.Global + "/customDropdownMenu";

    public IEnumerable<MenuItem> GetMenuItems()
    {
        var menuItems = new List<MenuItem>();

        var userMenu = new DropDownMenuItem("Optimizely blogs", DropdownMenuPath)
        {
            SortIndex = SortIndex.Last - 20,
            Alignment = MenuItemAlignment.Right
        };
        menuItems.Add(userMenu);

        menuItems.Add(new UrlMenuItem("CMS", DropdownMenuPath + "/item1",
            "https://world.episerver.com/blogs/?type=cmsblog&page=1")
        {
            SortIndex = 1,
        });

        menuItems.Add(new UrlMenuItem("Commerce", DropdownMenuPath + "/item2",
            "https://world.episerver.com/blogs/?type=commerceblog&page=1")
        {
            SortIndex = 2,
        });

        menuItems.Add(new UrlMenuItem("Find", DropdownMenuPath + "/item3",
            "https://world.episerver.com/blogs/?type=findblog&page=1")
        {
            SortIndex = 3,
        });

        return menuItems;
    }
}
