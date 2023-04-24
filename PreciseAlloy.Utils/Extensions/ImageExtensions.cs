using EPiServer;
using EPiServer.Core;
using EPiServer.ServiceLocation;
using EPiServer.Web.Routing;
using PreciseAlloy.Models.Media;

namespace PreciseAlloy.Utils.Extensions;

public static class ImageExtensions
{
    private static readonly Injected<IContentLoader> ContentLoaderInjected;
    private static IContentLoader ContentLoader => ContentLoaderInjected.Service;

    private static readonly Injected<IUrlResolver> UrlResolverInjected;
    private static IUrlResolver UrlResolver => UrlResolverInjected.Service;
    
    public static ImageInfo? GetImageInfo(this ContentReference imageContentLink, string alt, string title)
    {
        if (ContentReference.IsNullOrEmpty(imageContentLink) ||
            !ContentLoader.TryGet<ImageFile>(imageContentLink, out var image))
        {
            return null;
        }

        return new ImageInfo
        {
            Url = UrlResolver.GetUrl(image),
            CenterX = image.CenterX,
            CenterY = image.CenterY,
            TitleText = string.IsNullOrWhiteSpace(title) ? alt : title,
            Width = image.ImageWidth.GetValueOrDefault(),
            Height = image.ImageHeight.GetValueOrDefault()
        };
    }
    
}