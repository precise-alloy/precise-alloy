using EPiServer.Framework.Web.Resources;
using PreciseAlloy.Web.Generated;

namespace PreciseAlloy.Web.Infrastructure;

[ClientResourceProvider]
// ReSharper disable once UnusedMember.Global
public class CustomClientResourceProvider
    : IClientResourceProvider
{
    public IEnumerable<ClientResource> GetClientResources()
    {
        return
        [
            new ClientResource
            {
                Name = "epi-cms.widgets.base",
                Path = AssetPaths.BCmsEditorCss,
                ResourceType = ClientResourceType.Style
            }
        ];
    }
}