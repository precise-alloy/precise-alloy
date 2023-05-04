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
// ReSharper disable once UnusedMember.Global
public class MediaDataInitialization
    : IInitializableModule
{
    private static readonly Injected<ILogger> Logger;

    public void Initialize(InitializationEngine context)
    {
        var contentEvent = ServiceLocator.Current.GetInstance<IContentEvents>();
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

        try
        {
            FillImageInformation(imageFile);
        }
        catch (Exception e)
        {
            Logger.Service.LogError(e, "Cannot update media information.");
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
            Logger.Service.LogError(e, "Cannot get image file size");
            return null;
        }
    }

    public void Uninitialize(InitializationEngine context)
    {
    }
}