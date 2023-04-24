using EPiServer.Framework;
using EPiServer.Framework.Initialization;
using EPiServer.ServiceLocation;
using EPiServer.Web;
using PreciseAlloy.Models.Interfaces;
using PreciseAlloy.Models.Media;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

namespace PreciseAlloy.Web.Infrastructure;

[InitializableModule]
[ModuleDependency(typeof(InitializationModule))]
public class MediaDataInitialization : IInitializableModule
{
    private static Injected<ILogger> _logger;

    public void Initialize(InitializationEngine context)
    {
        var contentEvent = ServiceLocator.Current.GetInstance<IContentEvents>();
        contentEvent.SavingContent += OnSavingContent;
    }

    private void OnSavingContent(object? sender, ContentEventArgs e)
    {
        if (e.Content is IMediaInfo mediaInfo)
        {
            UpdateMediaInformation(mediaInfo);
        }
    }

    private void UpdateMediaInformation(IMediaInfo mediaInfo)
    {
        mediaInfo.FileSize = GetFileSize((MediaData)mediaInfo);
        if (mediaInfo is not ImageFile imageFile)
        {
            return;
        }

        try
        {
            FillImageInformation(imageFile);
        }
        catch (Exception e)
        {
            _logger.Service.LogError(e, null);
            throw;
        }
    }

    private void FillImageInformation(ImageFile imageFile)
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

    private int? GetFileSize(MediaData mediaData)
    {
        try
        {
            using Stream? stream = mediaData.BinaryData?.OpenRead();
            return (int?)stream?.Length;
        }
        catch (Exception e)
        {
            _logger.Service.LogError(e, null);
            return null;
        }
    }

    public void Uninitialize(InitializationEngine context)
    {
    }
}