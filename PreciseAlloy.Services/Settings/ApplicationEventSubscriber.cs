using EPiServer.Applications;
using EPiServer.Events;
using Microsoft.Extensions.Logging;

namespace PreciseAlloy.Services.Settings;

public class ApplicationEventSubscriber(
    ILogger<ApplicationEventSubscriber> logger,
    ISettingsService settingsService)
    : IEventSubscriber<ApplicationEvent>
{
    public async Task HandleAsync(
        ApplicationEvent eventData,
        EventContext context,
        CancellationToken cancellationToken = default(CancellationToken))
    {
        switch (eventData)
        {
            case ApplicationCreatedEvent createdEvent:
                settingsService.SiteCreated(this, createdEvent);
                break;

            case ApplicationDeletedEvent deletedEvent:
                settingsService.SiteDeleted(this, deletedEvent);
                break;

            case ApplicationUpdatedEvent updatedEvent:
                settingsService.SiteUpdated(this, updatedEvent);
                break;

            default:
                logger.LogWarning("Received unsupported event type {EventType}", eventData.GetType().FullName);
                break;
        }

        await Task.CompletedTask;
    }
}
