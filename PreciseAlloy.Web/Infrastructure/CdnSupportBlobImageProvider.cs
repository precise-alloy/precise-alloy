using Baaijte.Optimizely.ImageSharp.Web.Providers;
using SixLabors.ImageSharp.Web;

namespace PreciseAlloy.Web.Infrastructure;

public class CdnSupportBlobImageProvider : BlobImageProvider
{
    public CdnSupportBlobImageProvider(IWebHostEnvironment environment, FormatUtilities formatUtilities) : base(environment, formatUtilities)
    {
        Match = IsMatch;
    }

    private static bool IsMatch(HttpContext context)
    {
        var path = context.Request.Path.ToString();

        return path.Contains("/contentassets/", StringComparison.OrdinalIgnoreCase)
               || path.Contains("/globalassets/", StringComparison.OrdinalIgnoreCase)
               || path.Contains("/siteassets/", StringComparison.OrdinalIgnoreCase);
    }
}