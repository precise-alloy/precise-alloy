namespace PreciseAlloy.Web.Features.Blocks;

public interface IBlockViewModel<out T>
    where T : class
{
    T CurrentBlock { get; }
}
