﻿using EPiServer.Shell;
using EPiServer.Shell.ViewComposition;

namespace PreciseAlloy.Web.Settings;

[Component]
// ReSharper disable once UnusedMember.Global
public sealed class GlobalSettingsComponent
    : ComponentDefinitionBase
{
    public GlobalSettingsComponent()
        : base("epi-cms/component/MainNavigationComponent")
    {
        LanguagePath = "/episerver/cms/components/globalsettings";
        Title = "Site Settings";
        SortOrder = 1000;
        PlugInAreas = new[] { PlugInArea.AssetsDefaultGroup };
        Settings.Add(new Setting("repositoryKey", value: GlobalSettingsRepositoryDescriptor.RepositoryKey));
    }
}
