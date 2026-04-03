using EPiServer.Framework;
using EPiServer.Framework.Initialization;
using EPiServer.ServiceLocation;
using Microsoft.Extensions.DependencyInjection.Extensions;
using PreciseAlloy.Services.Navigation;

namespace PreciseAlloy.Web.Infrastructure;

[InitializableModule]
[ModuleDependency(typeof(EPiServer.Web.InitializationModule))]
public class SiteInitializationModule : IConfigurableModule
{
    public void ConfigureContainer(ServiceConfigurationContext context)
    {
        context.Services.TryAddSingleton<IBreadcrumbService, BreadcrumbService>();
    }

    public void Initialize(InitializationEngine context)
    {
        //Add initialization logic, this method is called once after CMS has been initialized
    }

    public void Uninitialize(InitializationEngine context)
    {
    }
}
