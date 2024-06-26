﻿using PreciseAlloy.Models.Blocks;

namespace PreciseAlloy.Web.Features.Blocks.Footer;

public class FooterViewModel
{
    public IEnumerable<SocialLinkBlock>? SocialLinks { get; set; }
    public string? CopyrightText { get; set; }
}
