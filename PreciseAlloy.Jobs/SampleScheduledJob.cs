using EPiServer.PlugIn;
using Microsoft.Extensions.Logging;

namespace PreciseAlloy.Jobs;

[ScheduledPlugIn(
    DisplayName = "Sample Scheduled Job",
    Description = "A sample schedule job.",
    GUID = "7747300c-34f5-4319-86f7-2107aa8479df")]
// ReSharper disable once UnusedMember.Global
public class SampleScheduledJob : ScheduledJobBase
{
    private static readonly Random Random = new();

    public SampleScheduledJob(ILogger<SampleScheduledJob> logger)
        : base(logger)
    {
    }

    public override string Execute()
    {
        Total = Random.Next(100, 500);
        for (var i = 1; i <= Total; i++)
        {
            Processed++;
            CurrentItem = i.ToString();
            Report();

            Task
                .Delay(Random.Next(200, 1000))
                .Wait();

            if (StopSignaled)
            {
                return GetStopMessage();
            }

            var isSuccess = Random.NextDouble() < 0.75;
            if (isSuccess)
            {
                Succeeded++;
            }
            else
            {
                Logger.LogError("Failed to execute item: " + CurrentItem);
                Failed++;
            }

            if (StopSignaled)
            {
                return GetStopMessage();
            }
        }

        return GetFinishMessage();
    }
}
