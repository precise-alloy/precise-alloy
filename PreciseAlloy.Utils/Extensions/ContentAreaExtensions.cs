using EPiServer;
using EPiServer.Core;
using EPiServer.ServiceLocation;

namespace PreciseAlloy.Utils.Extensions;

// ReSharper disable once UnusedMember.Global
public static class ContentAreaExtensions
{
    private static readonly Injected<IContentRepository> ContentRepository;
    
    public static IEnumerable<T> LoadContent<T>(
        this ContentArea? contentArea)
        where T : class, IContentData
    {
        return ContentRepository.Service.ContentAreaItems<T>(contentArea);
    }
}
