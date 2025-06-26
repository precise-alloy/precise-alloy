using Microsoft.AspNetCore.Mvc.Razor;
using PreciseAlloy.Models.Constants;
using PreciseAlloy.Models.Settings;
using PreciseAlloy.Services.Settings;
using PreciseAlloy.Utils.Extensions;

// ReSharper disable UseStringInterpolation

namespace PreciseAlloy.Web.Infrastructure;

public class CustomViewLocationExpander
    : IViewLocationExpander
{
    public IEnumerable<string> ExpandViewLocations(
        ViewLocationExpanderContext context,
        IEnumerable<string> viewLocations)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(viewLocations);

        bool hasLayoutType = context.Values.TryGetValue(
                                 LayoutTypes.LayoutTypeKey,
                                 out string? layoutType)
                             && layoutType != LayoutTypes.Default;

        string[] segments = context.ViewName.Split('/');
        if (segments is ["Components", _, _])
        {
            if (segments[1].EndsWith("Block"))
            {
                if (hasLayoutType)
                {
                    yield return string.Format("/Features/Blocks/{0}/{1}.{2}.cshtml", segments[1][..^5], segments[2], layoutType);
                }

                yield return string.Format("/Features/Blocks/{0}/{1}.cshtml", segments[1][..^5], segments[2]);
            }

            if (hasLayoutType)
            {
                yield return string.Format("/Features/Blocks/{0}/{1}.{2}.cshtml", segments[1], segments[2], layoutType);
            }

            yield return string.Format("/Features/Blocks/{0}/{1}.cshtml", segments[1], segments[2]);
        }

        else if (context.ControllerName?.EndsWith("Page") == true
                 && !string.IsNullOrWhiteSpace(context.ViewName))
        {
            string? pageName = context.ControllerName[..^4];

            if (hasLayoutType)
            {
                yield return string.Format("/Features/Pages/{0}/{1}.{2}.cshtml", pageName, context.ViewName, layoutType);
            }

            yield return string.Format("/Features/Pages/{0}/{1}.cshtml", pageName, context.ViewName);
        }

        if (hasLayoutType)
        {
            yield return string.Format("/Features/Shared/{{0}}.{0}.cshtml", layoutType);
        }

        yield return "/Features/Shared/{0}.cshtml";
        yield return "/Features/Plugins/{1}/{0}.cshtml";

        foreach (string location in viewLocations)
        {
            yield return location;
        }
    }

    public void PopulateValues(
        ViewLocationExpanderContext context)
    {
        ArgumentNullException.ThrowIfNull(context);
        string? layoutType = context.ActionContext.HttpContext.GetLayoutType();

        if (string.IsNullOrEmpty(layoutType))
        {
            try
            {
                layoutType = context.ActionContext.HttpContext
                    .RequestServices.GetRequiredService<ISettingsService>()
                    .GetSiteSettings<LayoutSettings>()
                    ?.LayoutType;
            }
            catch (Exception ex)
            {
                ILogger<CustomViewLocationExpander> logger = context.ActionContext.HttpContext.RequestServices
                    .GetRequiredService<ILogger<CustomViewLocationExpander>>();

                logger.LogError(ex, "Failed to get layout type from current context");
            }
        }

        if (!string.IsNullOrWhiteSpace(layoutType))
        {
            context.Values[LayoutTypes.LayoutTypeKey] = layoutType;
        }
    }
}