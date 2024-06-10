using EPiServer.Framework.Web.Resources;
using PreciseAlloy.Utils.Extensions;

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
                Path = HtmlExtensions.GetCacheBusterPath("/assets/css/b-cms-editor.css"),
                ResourceType = ClientResourceType.Style
            }
        ];
    }
}