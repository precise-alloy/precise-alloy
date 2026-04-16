using EPiServer.Core;
using EPiServer.Data.Entity;

namespace PreciseAlloy.Models.Settings;

public class SettingsBase
    : StandardContentBase, IReadOnly<IContent>
{
    public new IContent CreateWritableClone()
    {
        return (base.CreateWritableClone() as IContent)!;
    }
}
