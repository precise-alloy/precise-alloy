using System.Text.RegularExpressions;
using EPiServer.Core;

namespace PreciseAlloy.Utils.Extensions;

public static class ContentExtensions
{
    public static string GetAnchorUrl(this IContent? content)
    {
        if (content == null)
        {
            return string.Empty;
        }

        var segment = content.Name
            .ToLower();

        segment = Regex.Replace(segment, @"\W", "-");

        segment = Regex.Replace(segment, "^-*(.*?)-*$", "$1");

        segment = Regex.Replace(segment, "--+", "-");

        return segment;
    }
}
