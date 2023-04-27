using EPiServer;
using EPiServer.Core;
using EPiServer.ServiceLocation;
using EPiServer.Web.Routing;
using PreciseAlloy.Models.Media;

namespace PreciseAlloy.Utils.Extensions;

public static class ImageExtensions
{
    private static readonly Injected<IContentLoader> ContentLoader;

    private static readonly Injected<IUrlResolver> UrlResolver;
    
    public static ImageInfo? GetImageInfo(
        this ContentReference imageContentLink,
        string alt,
        string title)
    {
        if (ContentReference.IsNullOrEmpty(imageContentLink) ||
            !ContentLoader.Service.TryGet<ImageFile>(imageContentLink, out var image))
        {
            return null;
        }

        var url = UrlResolver.Service.GetUrl(image);

        return new ImageInfo
        {
            Url = url,
            CenterX = image.CenterX,
            CenterY = image.CenterY,
            TitleText = string.IsNullOrWhiteSpace(title) ? alt : title,
            Width = image.ImageWidth.GetValueOrDefault(),
            Height = image.ImageHeight.GetValueOrDefault()
        };
    }
    
}