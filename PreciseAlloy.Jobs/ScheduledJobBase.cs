using Microsoft.Extensions.Logging;
using PreciseAlloy.Utils.Extensions;
// ReSharper disable FieldCanBeMadeReadOnly.Local
#pragma warning disable CS0649

namespace PreciseAlloy.Jobs;

// ReSharper disable once UnusedMember.Global
public abstract class ScheduledJobBase
    : EPiServer.Scheduler.ScheduledJobBase
{
    protected readonly ILogger<ScheduledJobBase> Logger;
    protected bool StopSignaled;
    protected int Processed;
    protected int Total;
    protected int Succeeded;
    protected int Failed;
    protected string CurrentItem = string.Empty;
    private DateTime _lastNotificationTime = DateTime.UtcNow;

    protected ScheduledJobBase(
        ILogger<ScheduledJobBase> logger)
    {
        Logger = logger;
        Logger.EnterConstructor();
        IsStoppable = true;
        Logger.ExitConstructor();
    }

    public override void Stop()
    {
        StopSignaled = true;
        Logger.LogInformation("Stop signaled");
    }

    protected virtual string GetMessage(string? type)
    {
        var stats = $"Processed: {Processed:N0} of {Total:N0} items. Succeeded: {Succeeded:N0}. Failed: {Failed:N0}. Current item: {CurrentItem}";

        return string.IsNullOrWhiteSpace(type)
            ? stats
            : $"{type}. {stats}";
    }

    protected virtual string GetStopMessage()
    {
        return GetMessage("STOPPED");
    }

    protected virtual string GetFinishMessage()
    {
        return GetMessage("FINISHED");
    }

    // ReSharper disable once UnusedMember.Global
    protected virtual void Report()
    {
        // Report every 5 seconds.
        // This duration is long enough it does not cause performance issue
        if ((DateTime.UtcNow - _lastNotificationTime).TotalSeconds < 5)
        {
            return;
        }

        _lastNotificationTime = DateTime.UtcNow;
        OnStatusChanged(GetMessage(null));
    }
}
