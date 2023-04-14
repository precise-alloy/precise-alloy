using EPiServer.Cms.Shell.UI.CompositeViews.Internal;
using EPiServer.Framework.Localization;
using EPiServer.ServiceLocation;
using EPiServer.Shell;
using PreciseAlloy.Models.Settings;
using PreciseAlloy.Services.Settings;

namespace PreciseAlloy.Web.Settings;

[ServiceConfiguration(typeof(IContentRepositoryDescriptor))]
public class GlobalSettingsRepositoryDescriptor : ContentRepositoryDescriptorBase
{
    public static string RepositoryKey => "globalsettings";

    public override IEnumerable<Type> ContainedTypes => new[] { typeof(SettingsBase), typeof(SettingsFolder) };

    public override IEnumerable<Type> CreatableTypes => new[] { typeof(SettingsBase), typeof(SettingsFolder) };

    public override string CustomNavigationWidget => "epi-cms/component/ContentNavigationTree";

    public override string CustomSelectTitle => LocalizationService.Current.GetString($"/contentRepositories/{RepositoryKey}/customSelectTitle", "Settings");

    public override string Key => RepositoryKey;

    public override IEnumerable<Type> MainNavigationTypes => new[]
    {
        typeof(SettingsBase), typeof(SettingsFolder)
    };

    public override IEnumerable<string> MainViews => new[] { HomeView.ViewName };

    public override string Name => LocalizationService.Current.GetString($"/contentRepositories/{RepositoryKey}/name", "Site Settings");

    public override IEnumerable<ContentReference> Roots
    {
        get
        {
            if (_settings.Service?.GlobalSettingsRoot is { } root
                && !ContentReference.IsNullOrEmpty(root))
            {
                return new[] { root };
            }

            return new[] {ContentReference.EmptyReference,  };
        }
    }

    public override string SearchArea => GlobalSettingsSearchProvider.SearchArea;

    public override int SortOrder => 1000;

    private readonly Injected<ISettingsService> _settings;
}
