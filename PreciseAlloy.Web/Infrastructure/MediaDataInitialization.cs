using EPiServer.Framework;
using EPiServer.Framework.Initialization;
using EPiServer.ServiceLocation;
using EPiServer.Web;
using PreciseAlloy.Models.Interfaces;
using PreciseAlloy.Models.Media;
using SixLabors.ImageSharp.PixelFormats;

namespace PreciseAlloy.Web.Infrastructure;

[InitializableModule]
[ModuleDependency(typeof(InitializationModule))]
// ReSharper disable once UnusedMember.Global
public class MediaDataInitialization
    : IInitializableModule
{
    public void Initialize(InitializationEngine context)
    {
        var contentEvent = context.Locate.Advanced.GetInstance<IContentEvents>();
        contentEvent.SavingContent += OnSavingContent;
    }

    private static void OnSavingContent(
        object? sender,
        ContentEventArgs e)
    {
        if (e.Content is IMediaInfo mediaInfo)
        {
            UpdateMediaInformation(mediaInfo);
        }
    }

    private static void UpdateMediaInformation(IMediaInfo mediaInfo)
    {
        mediaInfo.FileSize = GetFileSize((MediaData)mediaInfo);
        if (mediaInfo is not ImageFile imageFile)
        {
            return;
        }

        if (mediaInfo is SvgImageFile)
        {
            return;
        }

        try
        {
            FillImageInformation(imageFile);
        }
        catch (Exception e)
        {
            var logger = ServiceLocator.Current.GetService<ILogger<MediaDataInitialization>>();
            logger?.LogError(e, "Cannot update media information.");
            throw;
        }
    }

    private static void FillImageInformation(ImageFile imageFile)
    {
        if (imageFile.BinaryData == null)
        {
            return;
        }

        using Stream stream = imageFile.BinaryData.OpenRead();
        using Image<Rgba32> img = Image.Load<Rgba32>(stream);
        imageFile.ImageWidth = img.Width;
        imageFile.ImageHeight = img.Height;
    }

    private static int? GetFileSize(IBinaryStorable mediaData)
    {
        try
        {
            using Stream? stream = mediaData.BinaryData?.OpenRead();
            return (int?)stream?.Length;
        }
        catch (Exception e)
        {
            var logger = ServiceLocator.Current.GetService<ILogger<MediaDataInitialization>>();
            logger?.LogError(e, "Cannot get image file size");
            return null;
        }
    }

    public void Uninitialize(InitializationEngine context)
    {
    }
}