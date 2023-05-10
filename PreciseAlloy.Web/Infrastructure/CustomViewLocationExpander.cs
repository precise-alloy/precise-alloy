using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.RazorPages;
// ReSharper disable UseStringInterpolation

namespace PreciseAlloy.Web.Infrastructure;

public class CustomViewLocationExpander
    : IViewLocationExpander
{
    public IEnumerable<string> ExpandViewLocations(
        ViewLocationExpanderContext context,
        IEnumerable<string> viewLocations)
    {
        if (context == null)
        {
            throw new ArgumentNullException(nameof(context));
        }

        if (viewLocations == null)
        {
            throw new ArgumentNullException(nameof(viewLocations));
        }

        var segments = context.ViewName.Split('/');
        if (segments.Length == 3
            && segments[0] == "Components")
        {
            if (segments[1].EndsWith("Block"))
            {
                yield return string.Format("/Features/Blocks/{0}/{1}.cshtml", segments[1][..^5], segments[2]);
            }
            yield return string.Format("/Features/Blocks/{0}/{1}.cshtml", segments[1], segments[2]);
        }

        else if (context.ControllerName?.EndsWith("Page") == true
            && !string.IsNullOrWhiteSpace(context.ViewName))
        {
            var pageName = context.ControllerName[..^4];

            yield return string.Format("/Features/Pages/{0}/{1}.cshtml", pageName, context.ViewName);
        }

        yield return "/Features/Shared/{0}.cshtml";

        foreach (var location in viewLocations)
        {
            yield return location;
        }
    }

    public void PopulateValues(ViewLocationExpanderContext context)
    {
    }
}
