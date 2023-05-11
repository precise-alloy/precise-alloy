﻿using EPiServer.Shell.Navigation;

namespace PreciseAlloy.Web.Features.Plugins;

[MenuProvider]
public class GlobalSectionMenuProvider : IMenuProvider
{
    const string MainMenuPath = MenuPaths.Global + "/customSection";

    public IEnumerable<MenuItem> GetMenuItems()
    {
        var menuItems = new List<MenuItem>
        {
            new SectionMenuItem("Optimizely Forum", MainMenuPath)
            {
                SortIndex = SortIndex.Last + 10
            },
            new UrlMenuItem("CMS", MainMenuPath + "/item1",
                "https://world.episerver.com/forum/developer-forum/-Optimizely-75-CMS/")
            {
                SortIndex = 1,
            },
            new UrlMenuItem("Commerce", MainMenuPath + "/item2",
                "https://world.episerver.com/forum/developer-forum/Optimizely-Commerce/")
            {
                SortIndex = 2,
            },
            new UrlMenuItem("Forms", MainMenuPath + "/item3",
                "https://world.episerver.com/forum/developer-forum/episerver-forms/")
            {
                SortIndex = 3,
            }
        };

        return menuItems;
    }
}