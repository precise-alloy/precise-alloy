using PreciseAlloy.Models.Media;
using SixLabors.ImageSharp.Processing;

namespace PreciseAlloy.Web.Features.Components.ImageView;

public class ImageViewModel
{
    private static readonly string[] WebpCompatibleExtensions = { ".jpg", ".jpeg", ".png" };

    private static readonly int[] ImageBaseSizes = { 600, 1024 };

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

    private static string Url(string url, int? width, ResizeMode resizeMode, double? centerX, double? centerY,
        bool extendWidth = false)
    {
        bool useCenter = centerX != null || centerY != null;

        var queryParams = new[]
        {
            width > 0 ? "width=" + width : null,
            useCenter ? FormattableString.Invariant($"rxy={centerX},{centerY}") : null,
            "rmode=" + resizeMode.ToString().ToLowerInvariant(),
            IsWebpCompatible(url) ? "format=webp" : null,
            "quality=80"
        }.Where(x => !string.IsNullOrWhiteSpace(x));

        var query = string.Join("&", queryParams);

        if (string.IsNullOrWhiteSpace(query))
        {
            return url;
        }

        var separator = url.Contains('?') ? "&" : "?";

        return url + separator + query + (extendWidth ? " " + width + "w" : string.Empty);
    }

    private static bool IsWebpCompatible(string url)
    {
        return !string.IsNullOrWhiteSpace(url) &&
               WebpCompatibleExtensions.Any(x => url.Split("?")[0].EndsWith(x, StringComparison.OrdinalIgnoreCase));
    }

    public ImageViewModel(ImageInfo imageInfo, int? width = null, int? height = null, string? imageClass = null)
    {
        ImageInfo = imageInfo;
        Width = width ?? imageInfo.Width;
        Height = height ?? imageInfo.Height;
        ImageCss = imageClass;

        ImageSources = ImageBaseSizes.Where(w => Width > w).Select(w =>
            new ImageSource(w, Url(imageInfo.Url, w, ResizeMode, imageInfo.CenterX, imageInfo.CenterY, true),
                $"(max-width: {w}px)"));
    }
}

public class ImageSource
{
    public ImageSource(int maxWidth, string url, string mediaScreen)
    {
        MaxWidth = maxWidth;
        Url = url;
        MediaScreen = mediaScreen;
    }

    public int MaxWidth { get; }

    public string Url { get; }

    public string MediaScreen { get; }
}