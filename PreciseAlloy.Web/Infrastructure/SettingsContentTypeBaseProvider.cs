using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAbstraction.RuntimeModel;
using PreciseAlloy.Models.Settings;

namespace PreciseAlloy.Web.Infrastructure;

public class SettingsContentTypeBaseProvider : IContentTypeBaseProvider
{
    private static readonly ContentTypeBase Settings = new("Settings");

    private static readonly Dictionary<ContentTypeBase, Type> Map = new()
    {
        { Settings, typeof(SettingsBase) }
    };

    IEnumerable<ContentTypeBase> IContentTypeBaseProvider.ContentTypeBases => Map.Keys;

    Type IContentTypeBaseProvider.Resolve(ContentTypeBase contentTypeBase) =>
        Map.TryGetValue(contentTypeBase, out var type) ? type : null!;
}
