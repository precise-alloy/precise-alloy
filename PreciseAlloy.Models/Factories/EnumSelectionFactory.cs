using EPiServer.Framework.Localization;
using EPiServer.Shell.ObjectEditing;

namespace PreciseAlloy.Models.Factories;

/// <summary>
///     A selection factory, for use with the EnumEditorDescriptor, that supports localized enum values.
/// </summary>
/// <typeparam name="TEnum">The type of the t enum.</typeparam>
public class EnumSelectionFactory<TEnum>
    : ISelectionFactory
{
    /// <summary>
    ///     Gets the selections.
    /// </summary>
    /// <param name="metadata">The metadata.</param>
    /// <returns>IEnumerable&lt;ISelectItem&gt;.</returns>
    public IEnumerable<ISelectItem> GetSelections(
        ExtendedMetadata metadata)
    {
        Array values = Enum.GetValues(typeof(TEnum));
        foreach (object? value in values)
        {
            yield return new SelectItem
            {
                Text = GetValueName(value),
                Value = value
            };
        }
    }

    /// <summary>
    ///     Gets the name of the value.
    /// </summary>
    /// <param name="value">The value.</param>
    /// <returns>System.String.</returns>
    private static string? GetValueName(object value)
    {
        string? staticName = Enum.GetName(typeof(TEnum), value);
        string localizationPath = $"/enums/{typeof(TEnum).Name.ToLowerInvariant()}/{staticName?.ToLowerInvariant()}";
        return LocalizationService.Current
            .TryGetString(
                localizationPath,
                out string? localizedName)
            ? localizedName
            : staticName;
    }
}