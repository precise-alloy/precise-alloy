using EPiServer.Framework;
using EPiServer.Framework.Initialization;
using EPiServer.ServiceLocation;
using PreciseAlloy.Services.Settings;

namespace PreciseAlloy.Web.Infrastructure;

[ModuleDependency(typeof(EPiServer.Web.InitializationModule))]
// ReSharper disable once UnusedMember.Global
public class SettingsInitialization : IConfigurableModule
{
    void IConfigurableModule.ConfigureContainer(ServiceConfigurationContext context)
    {
    }

    void IInitializableModule.Initialize(InitializationEngine context)
    {
        context.InitComplete += (_, _) =>
        {
            context.Locate.Advanced
                .GetInstance<ISettingsService>()
                .InitializeSettings();
        };
    }

    void IInitializableModule.Uninitialize(InitializationEngine context)
    {
    }

}
