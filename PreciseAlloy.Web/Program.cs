using Serilog;

namespace PreciseAlloy.Web;

public class Program
{
    public static void Main(
        string[] args)
    {
        CreateHostBuilder(args)
            .Build()
            .Run();
    }

    public static IHostBuilder CreateHostBuilder(
        string[] args)
    {
        var hostBuilder = Host.CreateDefaultBuilder(args)
            .ConfigureCmsDefaults();

        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
        var isDevelopment = environment == Environments.Development;

        if (isDevelopment)
        {
            var configuration = new ConfigurationBuilder()
                 .AddJsonFile("appsettings.json", false, true)
                 .AddJsonFile($"appsettings.{environment}.json", true, true)
                 .AddJsonFile($"appsettings.{Environment.MachineName}.json", true, true)
                 .AddUserSecrets<Program>()
                 .AddEnvironmentVariables()
                 .Build();

            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(configuration)
                .CreateLogger();

            hostBuilder = hostBuilder.UseSerilog();
        }

        hostBuilder = hostBuilder.ConfigureWebHostDefaults(webBuilder =>
        {
            webBuilder.UseStartup<Startup>();
        });

        return hostBuilder;
    }
}
