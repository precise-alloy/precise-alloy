namespace PreciseAlloy.Models.Media;

public class ImageInfo : AssetInfo
{
    public double? CenterX { get; set; }

    public double? CenterY { get; set; }

    public string? AltText { get; set; }

    public string? TitleText { get; set; }

    public int Width { get; set; }
        
    public int Height { get; set; }
}