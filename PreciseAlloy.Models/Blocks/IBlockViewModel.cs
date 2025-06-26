namespace PreciseAlloy.Models.Blocks;

public interface IBlockViewModel<out T>
    where T : class
{
    T CurrentBlock { get; }
}