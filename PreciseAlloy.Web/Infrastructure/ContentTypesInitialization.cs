using System.Reflection;
using EPiServer.Framework;
using EPiServer.Framework.Initialization;
using EPiServer.PlugIn;
using EPiServer.ServiceLocation;
using PreciseAlloy.Jobs;
using PreciseAlloy.Models.Blocks;
using PreciseAlloy.Services.Settings;
using PreciseAlloy.Utils.Extensions;

namespace PreciseAlloy.Web.Infrastructure;

[ModuleDependency(typeof(EPiServer.Web.InitializationModule))]
// ReSharper disable once UnusedMember.Global
public class ContentTypesInitialization
    : IConfigurableModule
{
    private readonly Type[] _typesForAssemblyScanning = new[]
    {
        typeof(ScheduledJobBase),   // PreciseAlloy.Jobs
        typeof(BaseBlockData),      // PreciseAlloy.Models
        typeof(ISettingsService),   // PreciseAlloy.Services
        typeof(HtmlExtensions),     // PreciseAlloy.Utils
        typeof(Program)             // PreciseAlloy.Web
    };

    public void Initialize(InitializationEngine context)
    {
        ValidateContentTypes();
    }

    public void Uninitialize(InitializationEngine context)
    {
    }

    public void ConfigureContainer(ServiceConfigurationContext context)
    {
    }

    private void ValidateContentTypes()
    {
        var assemblies = _typesForAssemblyScanning
            .SelectMany(t => t.Assembly.GetTypes())
            .ToList();

        var blockOrPageTypes = assemblies
            .Where(myType => myType is { IsClass: true, IsAbstract: false }
                             && myType.IsSubclassOf(typeof(ContentData)));

        foreach (Type type in blockOrPageTypes)
        {
            var contentType = type.GetCustomAttribute<ContentTypeAttribute>();
            if (contentType == null
                || string.IsNullOrWhiteSpace(contentType.DisplayName)
                || string.IsNullOrWhiteSpace(contentType.GUID))
            {
                throw new Exception($"ContentType attribute with Display Name and unique GUID is required for {type.FullName}");
            }
        }

        var scheduleJobs = assemblies
            .Where(myType => myType is { IsClass: true, IsAbstract: false }
                             && myType.IsSubclassOf(typeof(ScheduledJobBase)));

        foreach (Type scheduleJob in scheduleJobs)
        {
            var scheduledPlugInAttribute = scheduleJob.GetCustomAttribute<ScheduledPlugInAttribute>();
            if (scheduledPlugInAttribute == null
                || string.IsNullOrWhiteSpace(scheduledPlugInAttribute.DisplayName)
                || string.IsNullOrWhiteSpace(scheduledPlugInAttribute.GUID))
            {
                throw new Exception($"ScheduledPlugIn attribute with Display Name and unique GUID is required for {scheduleJob.FullName}");
            }
        }
    }
}
