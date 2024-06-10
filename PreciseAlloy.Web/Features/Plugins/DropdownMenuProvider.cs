using EPiServer.Shell.Navigation;

namespace PreciseAlloy.Web.Features.Plugins;

[MenuProvider]
// ReSharper disable once UnusedMember.Global
public class DropdownMenuProvider
    : BaseMenuProvider
{
    const string DropdownMenuPath = MenuPaths.Global + "/customDropdownMenu";

    public override IEnumerable<MenuItem> GetMenuItems()
    {
        var menuItems = new List<MenuItem>();

        var userMenu = new DropDownMenuItem("Optimizely blogs", DropdownMenuPath)
        {
            IsAvailable = _ => true,
            SortIndex = SortIndex.Last - 20,
            Alignment = MenuItemAlignment.Right
        };
        menuItems.Add(userMenu);

        menuItems.Add(new UrlMenuItem("CMS", DropdownMenuPath + "/item1",
            "https://world.episerver.com/blogs/?type=cmsblog&page=1")
        {
            IsAvailable = _ => true,
            SortIndex = 1,
        });

        menuItems.Add(new UrlMenuItem("Commerce", DropdownMenuPath + "/item2",
            "https://world.episerver.com/blogs/?type=commerceblog&page=1")
        {
            IsAvailable = _ => true,
            SortIndex = 2,
        });

        menuItems.Add(new UrlMenuItem("Find", DropdownMenuPath + "/item3",
            "https://world.episerver.com/blogs/?type=findblog&page=1")
        {
            IsAvailable = _ => true,
            SortIndex = 3,
        });

        return menuItems;
    }
}