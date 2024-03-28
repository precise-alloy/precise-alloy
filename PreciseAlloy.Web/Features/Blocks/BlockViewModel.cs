﻿using PreciseAlloy.Utils.Extensions;

namespace PreciseAlloy.Web.Features.Blocks;

public class BlockViewModel<T>(T currentBlock) : IBlockViewModel<T>
    where T : BlockData
{
    public T CurrentBlock { get; } = currentBlock;

    // ReSharper disable once SuspiciousTypeConversion.Global
    public string AnchorId => (CurrentBlock as IContent).GetAnchorUrl();
}