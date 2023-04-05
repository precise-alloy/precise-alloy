using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using System.ComponentModel.DataAnnotations;

namespace PreciseAlloy.Models.Constants;

[GroupDefinitions]
internal static class TabNames
{
    [Display(Order = 1000)]
    public const string Content = SystemTabNames.Content;

    [Display(Order = 1500, Name = "File Information")]
    public const string FileInfo = "FileInfo";

    [Display(Order = 1600, Name = "SEO")]
    public const string MetaData = "Metadata";

    [Display(Order = 1700, Name = "Site SEO")]
    public const string SiteMetaData = "SiteMetaData";

    [Display(Order = 1800, Name = "Site Settings")]
    public const string SiteSettings = "SiteSettings";

    [Display(Order = 1900, Name = "Footer")]
    public const string Footer = "Footer";

    [Display(Order = 2000, Name = "Navigation")]
    public const string Navigation = "Navigation";

    [Display(Order = 9000)]
    public const string Settings = SystemTabNames.Settings;
}
