import { DetailLinkItem } from "../cards/DetailLinkItem";
import { FormTextInput } from "../FormTextInput";
import type { KanjiComponentRequest } from "../../types/kanji";
import { FormItemCarousel, useFormItemSelection } from "./FormItemCarousel";

type KanjiComponentEditorProps = {
  components: KanjiComponentRequest[];
  onChange: (components: KanjiComponentRequest[]) => void;
};

function createEmptyComponent(): KanjiComponentRequest {
  return {
    writing: "",
    sino: "",
    meaning: "",
  };
}

export function KanjiComponentEditor({
  components,
  onChange,
}: KanjiComponentEditorProps) {
  const selection = useFormItemSelection(components.length);

  function saveComponent(index: number | null, component: KanjiComponentRequest) {
    if (index === null) {
      const nextComponents = [...components, component];
      onChange(nextComponents);
      selection.selectLastAfterAdd(nextComponents.length);
      return;
    }

    onChange(
      components.map((currentComponent, currentIndex) =>
        currentIndex === index ? component : currentComponent,
      ),
    );
    selection.setSelectedIndex(index);
  }

  function removeComponent(index: number) {
    const nextComponents = components.filter(
      (_, currentIndex) => currentIndex !== index,
    );
    onChange(nextComponents);
    selection.selectPreviousAfterRemove(nextComponents.length, index);
  }

  return (
    <FormItemCarousel
      items={components}
      selectedIndex={selection.selectedIndex}
      onSelectIndex={selection.setSelectedIndex}
      createItem={createEmptyComponent}
      onSaveItem={saveComponent}
      onRemoveItem={removeComponent}
      addLabel="Add component"
      emptyText="No components yet. Add one if this kanji is built from smaller parts."
      getEditorTitle={(_, index, mode) =>
        mode === "add"
          ? "Add component"
          : `Editing component ${(index ?? 0) + 1}`
      }
      getRemoveConfirmTitle={(_, __, mode) =>
        mode === "add" ? "Discard this component?" : "Remove this component?"
      }
      getRemoveConfirmMessage={(_, __, mode) =>
        mode === "add"
          ? "This closes the modal without adding the component."
          : "This removes the component from the form only. The change is saved when you submit."
      }
      renderCard={(component, index, selected, onPress) => (
        <DetailLinkItem
          compact
          scrollContent
          primary={component.writing || `Component ${index + 1}`}
          secondary={component.sino}
          tertiary={component.meaning}
          className={selected ? "border-blue-500 bg-blue-50" : ""}
          onPress={onPress}
        />
      )}
      renderEditor={(component, _, updateDraft) => (
        <>
          <FormTextInput
            label="Writing"
            value={component.writing}
            onChangeText={(value) =>
              updateDraft({
                ...component,
                writing: value,
              })
            }
          />

          <FormTextInput
            label="Sino"
            value={component.sino ?? ""}
            onChangeText={(value) =>
              updateDraft({
                ...component,
                sino: value,
              })
            }
          />

          <FormTextInput
            label="Meaning"
            value={component.meaning ?? ""}
            onChangeText={(value) =>
              updateDraft({
                ...component,
                meaning: value,
              })
            }
            multiline
          />
        </>
      )}
    />
  );
}
