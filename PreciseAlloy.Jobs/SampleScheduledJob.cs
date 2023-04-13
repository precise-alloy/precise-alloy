using EPiServer.PlugIn;
using Microsoft.Extensions.Logging;
using PreciseAlloy.Utils.Extensions;

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
        Logger.EnterConstructor();
        Logger.ExitConstructor();
    }

    public override string Execute()
    {
        Logger.EnterMethod();
        Total = Random.Next(10, 50);
        for (var i = 1; i <= Total; i++)
        {
            Logger.LogInformation("Process item " + i);
            Processed++;
            CurrentItem = i.ToString();
            Report();

            Task
                .Delay(Random.Next(200, 1000))
                .Wait();

            if (StopSignaled)
            {
                Logger.LogInformation("Job stopped");
                return GetStopMessage();
            }

            ProcessItem(i);


            if (StopSignaled)
            {
                Logger.LogInformation("Job stopped");
                return GetStopMessage();
            }
        }

        Logger.LogInformation("Job finished");
        return GetFinishMessage();
    }

    private void ProcessItem(int item)
    {
        Logger.EnterMethod();
        try
        {
            var isSuccess = Random.NextDouble() < 0.75;
            if (isSuccess)
            {
                Succeeded++;
            }
            else
            {
                throw new Exception("A sample exception");
            }
        }
        catch (Exception ex)
        {
            Failed++;
            Logger.LogError(ex, "Failed to execute item: " + CurrentItem);
        }
    }
}
