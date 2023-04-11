using Microsoft.Extensions.Logging;
using PreciseAlloy.Utils.Extensions;
// ReSharper disable FieldCanBeMadeReadOnly.Local
#pragma warning disable CS0649

namespace PreciseAlloy.Jobs;

// ReSharper disable once UnusedMember.Global
internal abstract class ScheduledJobBase
    : EPiServer.Scheduler.ScheduledJobBase
{
    protected readonly ILogger<ScheduledJobBase> Logger;
    protected bool StopSignaled;
    private DateTime _lastNotificationTime = DateTime.UtcNow;
    private int _processed;
    private int _total;
    private int _success;
    private int _fail;
    private string _currentItem = string.Empty;

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
        var stats = $"Processed: {_processed:N0} of {_total:N0} items. Succeeded: {_success:N0}. Failed: {_fail:N0}. Current item: {_currentItem}";

        return string.IsNullOrWhiteSpace(type)
            ? stats
            : $"{type}. {stats}";
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
