using Serilog;

namespace PreciseAlloy.Web;

public class Program
{
    public static IConfiguration Configuration { get; } =
        new ConfigurationBuilder()
            .AddJsonFile("appsettings.json", false, true)
            .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.json", true, true)
            .AddJsonFile($"appsettings.{Environment.MachineName}.json", true, true)
            .AddUserSecrets<Program>()
            .AddEnvironmentVariables()
            .Build();

    public static void Main(
        string[] args)
    {
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
        var isDevelopment = environment == Environments.Development;

        if (isDevelopment)
        {
            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(Configuration)
                .CreateLogger();
        }

        CreateHostBuilder(args, isDevelopment)
            .Build()
            .Run();
    }

    public static IHostBuilder CreateHostBuilder(
        string[] args,
        bool isDevelopment)
    {
        var hostBuilder = Host.CreateDefaultBuilder(args)
            .ConfigureCmsDefaults();

        if (isDevelopment)
        {
            hostBuilder = hostBuilder.UseSerilog();
        }

        hostBuilder = hostBuilder.ConfigureWebHostDefaults(webBuilder =>
        {
            webBuilder.UseStartup<Startup>();
        });

        return hostBuilder;
    }
}
