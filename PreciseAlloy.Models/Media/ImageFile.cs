using EPiServer.Core;
using PreciseAlloy.Models.Constants;
using PreciseAlloy.Models.Interfaces;

namespace PreciseAlloy.Models.Media;

public abstract class ImageFile : ImageData, IMediaInfo
{
    [Range(0.0, 1.0)]
    [Display(GroupName = TabNames.Content, Order = 30)]
    public virtual double? CenterX { get; set; }

    [Range(0.0, 1.0)]
    [Display(GroupName = TabNames.Content, Order = 40)]
    public virtual double? CenterY { get; set; }

    [Editable(false)]
    [Display(GroupName = TabNames.FileInfo, Order = 100)]
    public virtual int? FileSize { get; set; }

    [Editable(false)]
    [Display(GroupName = TabNames.FileInfo, Order = 110)]
    public virtual int? ImageWidth { get; set; }

    [Editable(false)]
    [Display(GroupName = TabNames.FileInfo, Order = 120)]
    public virtual int? ImageHeight { get; set; }
}
