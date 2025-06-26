using EPiServer.Shell.ObjectEditing;
using PreciseAlloy.Models.Constants;

namespace PreciseAlloy.Models.Factories;

internal class LayoutTypeSelectionFactory
    : ISelectionFactory
{
    public IEnumerable<ISelectItem> GetSelections(
        ExtendedMetadata metadata)
    {
        return
        [
            new SelectItem {Text = "Default", Value = LayoutTypes.Default}
        ];
    }
}