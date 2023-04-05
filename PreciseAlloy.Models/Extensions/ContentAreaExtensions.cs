using EPiServer.Core;
using EPiServer.ServiceLocation;
using EPiServer;

namespace PreciseAlloy.Models.Extensions
{
    public static class ContentAreaExtensions
    {
        private static Injected<IContentRepository> ContentRepository;

        public static IEnumerable<T> LoadContent<T>(
            this ContentArea contentArea)
            where T : class, IContentData
        {
            return ContentRepository.Service.ContentAreaItems<T>(contentArea);
        }
    }
}