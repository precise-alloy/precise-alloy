using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using PreciseAlloy.Web.Generated;

namespace PreciseAlloy.Web.Infrastructure;

/// <summary>
/// Watches <c>wwwroot/assets/hashes.json</c> in development and pushes new
/// cache-busting values into the generated <see cref="AssetPaths"/> table so
/// the BE devs do not need to rebuild when the FE pipeline rewrites hashes.
/// </summary>
public sealed class AssetPathsRefresher : IHostedService, IDisposable
{
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<AssetPathsRefresher> _logger;
    private FileSystemWatcher? _watcher;
    private CancellationTokenSource? _debounce;
    private string _hashesPath = string.Empty;

    public AssetPathsRefresher(
        IWebHostEnvironment env,
        ILogger<AssetPathsRefresher> logger)
    {
        _env = env;
        _logger = logger;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _hashesPath = Path.Combine(_env.WebRootPath, "assets", "hashes.json");
        ApplyFromDisk();

        var dir = Path.GetDirectoryName(_hashesPath);
        if (string.IsNullOrEmpty(dir) || !Directory.Exists(dir))
        {
            return Task.CompletedTask;
        }

        _watcher = new FileSystemWatcher(dir, "hashes.json")
        {
            NotifyFilter = NotifyFilters.LastWrite | NotifyFilters.Size | NotifyFilters.CreationTime,
            EnableRaisingEvents = true
        };
        _watcher.Changed += OnChanged;
        _watcher.Created += OnChanged;
        _watcher.Renamed += OnChanged;

        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _watcher?.Dispose();
        _watcher = null;
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _watcher?.Dispose();
        _debounce?.Dispose();
    }

    private void OnChanged(object sender, FileSystemEventArgs e)
    {
        // FileSystemWatcher fires repeatedly during a write; debounce.
        var cts = new CancellationTokenSource();
        var previous = Interlocked.Exchange(ref _debounce, cts);
        previous?.Cancel();
        previous?.Dispose();

        _ = Task.Delay(150, cts.Token).ContinueWith(t =>
        {
            if (t.IsCanceled)
            {
                return;
            }

            try
            {
                ApplyFromDisk();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to refresh AssetPaths from {Path}", _hashesPath);
            }
        }, TaskScheduler.Default);
    }

    private void ApplyFromDisk()
    {
        if (!File.Exists(_hashesPath))
        {
            return;
        }

        string json;
        try
        {
            // Use FileShare.ReadWrite so we don't fight the FE writer.
            using var stream = new FileStream(_hashesPath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            using var reader = new StreamReader(stream);
            json = reader.ReadToEnd();
        }
        catch (IOException)
        {
            // The file is mid-write; the next watcher event will retry.
            return;
        }

        var hashes = JsonConvert.DeserializeObject<Dictionary<string, string>>(json);
        if (hashes is null)
        {
            return;
        }

        AssetPaths.Refresh(hashes);
        _logger.LogDebug("AssetPaths refreshed from {Path} ({Count} entries)", _hashesPath, hashes.Count);
    }
}
