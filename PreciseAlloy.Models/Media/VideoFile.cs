using System.ComponentModel.DataAnnotations;
using PreciseAlloy.Models.Constants;
using PreciseAlloy.Models.Interfaces;
using EPiServer.Core;
using EPiServer.DataAnnotations;
using EPiServer.Framework.DataAnnotations;
using EPiServer.Web;

namespace PreciseAlloy.Models.Media
{
    [ContentType(
        GUID = "85468104-E06F-47E5-A317-FC9B83D3CBA6",
        DisplayName = "Video File",
        Description = "Video media file type. Supports .mp4, .mov extension.")]
    [MediaDescriptor(ExtensionString = "mp4,mov")]
    public class VideoFile : VideoData, IMediaInfo
    {
        [Display(GroupName = TabNames.Content, Order = 20)]
        public virtual string Title { get; set; }

        [UIHint(UIHint.Textarea)]
        [Display(GroupName = TabNames.Content, Order = 30)]
        public virtual string Description { get; set; }

        [Editable(false)]
        [Display(GroupName = TabNames.FileInfo, Order = 100)]
        public virtual int? FileSize { get; set; }
    }
}