using PreciseAlloy.Models.Constants;
using PreciseAlloy.Models.Settings;
using PreciseAlloy.Services.Settings;
using PreciseAlloy.Utils.Extensions;

namespace PreciseAlloy.Web.Infrastructure.Middlewares;

public class LayoutTypeMiddleware(
    RequestDelegate next)
{
    public async Task InvokeAsync(
        HttpContext context,
        ISettingsService settingsService)
    {
        LayoutSettings? layoutSettings = settingsService.GetSiteSettings<LayoutSettings>();
        string? layoutType = !string.IsNullOrWhiteSpace(layoutSettings?.LayoutType)
            ? layoutSettings.LayoutType
            : LayoutTypes.Default;

        context.SetLayoutType(layoutType);

        await next(context);
    }
}