﻿using System.ComponentModel.DataAnnotations;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAnnotations;
using EPiServer.SpecializedProperties;
using EPiServer.Web;

namespace PreciseAlloy.Models.Blocks;

[ContentType(
    DisplayName = "Teaser Block",
    Description = "",
    GUID = "e8dcda7f-54d7-4a8c-95ad-51ab3c41a45a")]
public class TeaserBlock
    : BaseBlockData
{
    [Display(
        Name = "Header",
        Description = "",
        GroupName = SystemTabNames.Content,
        Order = 100)]
    [CultureSpecific]
    public virtual string? Header { get; set; }

    [Display(
        Name = "Text",
        Description = "",
        GroupName = SystemTabNames.Content,
        Order = 200)]
    [CultureSpecific]
    public virtual XhtmlString? Text { get; set; }

    [Display(
        Name = "Image",
        Description = "",
        GroupName = SystemTabNames.Content,
        Order = 300)]
    [UIHint(UIHint.Image)]
    [CultureSpecific]
    public virtual ContentReference? Image { get; set; }

    [Display(
        Name = "Show Image On The Right",
        Description = "",
        GroupName = SystemTabNames.Content,
        Order = 400)]
    public virtual bool ShowImageOnTheRight { get; set; }

    [Display(
        Name = "Cta Button",
        Description = "",
        GroupName = SystemTabNames.Content,
        Order = 500)]
    public virtual LinkItem? CtaButton { get; set; }
}