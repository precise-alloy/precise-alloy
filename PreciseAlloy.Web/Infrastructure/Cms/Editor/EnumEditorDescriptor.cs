using EPiServer.Shell.ObjectEditing.EditorDescriptors;
using EPiServer.Shell.ObjectEditing;

namespace PreciseAlloy.Web.Infrastructure.Cms.Editor;

/// <summary>
/// Class EnumEditorDescriptor.
/// Implements the <see cref="EPiServer.Shell.ObjectEditing.EditorDescriptors.EditorDescriptor" />
/// </summary>
/// <typeparam name="TEnum">The type of the t enum.</typeparam>
/// <seealso cref="EPiServer.Shell.ObjectEditing.EditorDescriptors.EditorDescriptor" />
public class EnumEditorDescriptor<TEnum>
    : EditorDescriptor
{
    /// <summary>
    /// Modifies the metadata.
    /// </summary>
    /// <param name="metadata">The metadata.</param>
    /// <param name="attributes">The attributes.</param>
    public override void ModifyMetadata(ExtendedMetadata metadata, IEnumerable<Attribute> attributes)
    {
        SelectionFactoryType = typeof(EnumSelectionFactory<TEnum>);
        ClientEditingClass = "epi-cms/contentediting/editors/SelectionEditor";
        base.ModifyMetadata(metadata, attributes);
    }
}