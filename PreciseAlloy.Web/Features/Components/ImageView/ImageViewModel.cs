using PreciseAlloy.Models.Constants;
using PreciseAlloy.Models.Media;
using SixLabors.ImageSharp.Processing;

namespace PreciseAlloy.Web.Features.Components.ImageView;

public class ImageViewModel
{
    private static readonly string[] WebpCompatibleExtensions = { ".jpg", ".jpeg", ".png" };

    private static readonly int[] ImageBaseSizes =
    {
        600,
        1024
    };

    private ImageInfo ImageInfo { get; }

    public int? Width { get; }

    public int? Height { get; }

    public string Src => Url(ImageInfo.Url, Width, ResizeMode, ImageInfo.CenterX, ImageInfo.CenterY);

    public string? ImageCss { get; set; }

    public string? ImageInnerCss { get; set; }

    public bool HasImageData => !string.IsNullOrWhiteSpace(ImageInfo.Url);

    public string? AltText => ImageInfo.AltText;

    public string? TitleText => ImageInfo.TitleText;

    public ResizeMode ResizeMode { get; set; } = ResizeMode.Crop;

    public IEnumerable<ImageSource> ImageSources { get; }

    private static string Url(
        string url,
        int? width,
        ResizeMode resizeMode,
        double? centerX,
        double? centerY)
    {
        var urlBuilder = new UrlBuilder(url);

        if (width > 0)
        {
            urlBuilder.QueryCollection["width"] = width.ToString();
        }

        if (centerX > 0
            || centerY > 0)
        {
            urlBuilder.QueryCollection["rxy"] = centerX + "," + centerY;
        }

        if (IsWebpCompatible(url))
        {
            urlBuilder.QueryCollection["format"] = "webp";
        }

        // ReSharper disable once StringLiteralTypo
        urlBuilder.QueryCollection["rmode"] = resizeMode.ToString().ToLowerInvariant();
        urlBuilder.QueryCollection["quality"] = "80";

        return urlBuilder.ToString();
    }

    private static bool IsWebpCompatible(string url)
    {
        return !string.IsNullOrWhiteSpace(url)
               && WebpCompatibleExtensions
                   .Any(x => url.Split("?")[0].EndsWith(x, StringComparison.OrdinalIgnoreCase));
    }

    public ImageViewModel(
        ImageInfo imageInfo,
        int? width = null,
        int? height = null,
        string? imageClass = null)
    {
        ImageInfo = imageInfo;
        Width = width ?? imageInfo.Width;
        Height = height ?? imageInfo.Height;
        ImageCss = imageClass;

        ImageSources = ImageBaseSizes
            .Where(w => Width > w)
            .Select(w => new ImageSource(
                Url(imageInfo.Url, w, ResizeMode, imageInfo.CenterX, imageInfo.CenterY),
                w / Frontend.RootElementWidth));
    }
}

public class ImageSource
{
    public ImageSource(
        string url,
        double mediaMaxWidth)
    {
        Url = url;
        MediaMaxWidth = mediaMaxWidth;
    }

    public string Url { get; }

    public double MediaMaxWidth { get; }
}