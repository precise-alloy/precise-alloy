using Microsoft.Extensions.Logging;
using PreciseAlloy.Utils.Extensions;
// ReSharper disable FieldCanBeMadeReadOnly.Local
#pragma warning disable CS0649

namespace PreciseAlloy.Jobs;

/// <summary>
/// The base class for scheduled jobs.
/// </summary>
public abstract class SiteScheduledJobBase
    : EPiServer.Scheduler.ScheduledJobBase
{
    private DateTime _lastNotificationTime = DateTime.UtcNow;

    /// <summary>
    /// The logger.
    /// </summary>
    protected readonly ILogger<SiteScheduledJobBase> Logger;

    /// <summary>
    /// The flag to indicate if the job is waiting to be stopped.
    /// </summary>
    protected bool StopSignaled { get; private set; }

    /// <summary>
    /// The number of items processed.
    /// </summary>
    protected int Processed { get; set; }

    /// <summary>
    /// The total number of items to process.
    /// </summary>
    protected int Total { get; set; }

    /// <summary>
    /// The number of items that succeeded.
    /// </summary>
    protected int Succeeded { get; set; }

    /// <summary>
    /// The number of items that failed.
    /// </summary>
    protected int Failed { get; set; }

    /// <summary>
    /// The current item being processed.
    /// </summary>
    protected string? CurrentItem { get; set; }

    /// <summary>
    /// Initialize a new instance of the <see cref="SiteScheduledJobBase"/> class.
    /// </summary>
    /// <param name="logger"></param>
    protected SiteScheduledJobBase(
        ILogger<SiteScheduledJobBase> logger)
    {
        Logger = logger;
        Logger.EnterConstructor();
        IsStoppable = true;
        Logger.ExitConstructor();
    }

    /// <summary>
    /// Set the `StopSignaled` flag to true.
    /// </summary>
    public override void Stop()
    {
        StopSignaled = true;
        Logger.LogInformation("Stop signaled");
    }

    /// <summary>
    /// Get the current status of the job.
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    protected virtual string GetMessage(string? type)
    {
        return (!string.IsNullOrWhiteSpace(type) ? type + ". " : "")
               + $"Processed: {Processed:N0} of {Total:N0} items. "
               + $"Succeeded: {Succeeded:N0}. "
               + $"Failed: {Failed:N0}. "
               + $"Current item: {CurrentItem ?? "???"}.";
    }

    /// <summary>
    /// Get the current status of the job, and indicate that the job has stopped.
    /// </summary>
    /// <returns></returns>
    // ReSharper disable once UnusedMember.Global
    protected virtual string GetStopMessage()
    {
        return GetMessage("STOPPED");
    }

    /// <summary>
    /// Get the current status of the job, and indicate that the job has finished.
    /// </summary>
    /// <returns></returns>
    // ReSharper disable once UnusedMember.Global
    protected virtual string GetFinishMessage()
    {
        return GetMessage("FINISHED");
    }

    /// <summary>
    /// Report the current status of the job.
    /// </summary>
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
