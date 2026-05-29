import { DetailLinkItem } from "../cards/DetailLinkItem";
import { FormTextInput } from "../FormTextInput";
import { FormItemCarousel, useFormItemSelection } from "./FormItemCarousel";

type TagEditorProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
};

export function TagEditor({ tags, onChange }: TagEditorProps) {
  const selection = useFormItemSelection(tags.length);

  function saveTag(index: number | null, value: string) {
    if (index === null) {
      const nextTags = [...tags, value];
      onChange(nextTags);
      selection.selectLastAfterAdd(nextTags.length);
      return;
    }

    onChange(
      tags.map((tag, currentIndex) => (currentIndex === index ? value : tag)),
    );
    selection.setSelectedIndex(index);
  }

  function removeTag(index: number) {
    const nextTags = tags.filter((_, currentIndex) => currentIndex !== index);
    onChange(nextTags);
    selection.selectPreviousAfterRemove(nextTags.length, index);
  }

  return (
    <FormItemCarousel
      items={tags}
      selectedIndex={selection.selectedIndex}
      onSelectIndex={selection.setSelectedIndex}
      createItem={() => ""}
      onSaveItem={saveTag}
      onRemoveItem={removeTag}
      addLabel="Add tag"
      emptyText="No tags yet. Add one if this word needs grouping."
      getEditorTitle={(_, index, mode) =>
        mode === "add" ? "Add tag" : `Editing tag ${(index ?? 0) + 1}`
      }
      getRemoveConfirmTitle={(_, __, mode) =>
        mode === "add" ? "Discard this tag?" : "Remove this tag?"
      }
      getRemoveConfirmMessage={(_, __, mode) =>
        mode === "add"
          ? "This closes the modal without adding the tag."
          : "This removes the tag from the form only. The change is saved when you submit."
      }
      renderCard={(tag, index, selected, onPress) => (
        <DetailLinkItem
          compact
          primary={tag || `Tag ${index + 1}`}
          secondary={`Tag ${index + 1}`}
          className={selected ? "border-blue-500 bg-blue-50" : ""}
          onPress={onPress}
        />
      )}
      renderEditor={(tag, _, updateDraft) => (
        <FormTextInput label="Tag" value={tag} onChangeText={updateDraft} />
      )}
    />
  );
}
