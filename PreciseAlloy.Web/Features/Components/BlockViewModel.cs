using PreciseAlloy.Utils.Extensions;

namespace PreciseAlloy.Web.Features.Components;

public class BlockViewModel<T>
    : IBlockViewModel<T>
    where T : BlockData
{
    public BlockViewModel(T currentBlock) => CurrentBlock = currentBlock;

    public T CurrentBlock { get; }

    // ReSharper disable once SuspiciousTypeConversion.Global
    public string AnchorId => (CurrentBlock as IContent).GetAnchorUrl();
}