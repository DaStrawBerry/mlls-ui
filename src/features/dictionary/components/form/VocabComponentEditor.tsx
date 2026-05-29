import type { VocabComponentRequest } from "@/features/dictionary/types/vocab";
import { DetailLinkItem } from "../cards/DetailLinkItem";
import { FormTextInput } from "../FormTextInput";
import { FormItemCarousel, useFormItemSelection } from "./FormItemCarousel";

type VocabComponentEditorProps = {
  title?: string;
  components: VocabComponentRequest[];
  onChange: (components: VocabComponentRequest[]) => void;
};

function createEmptyComponent(): VocabComponentRequest {
  return {
    writing: "",
    reading: "",
    meaning: "",
  };
}

export function VocabComponentEditor({
  title = "Component",
  components,
  onChange,
}: VocabComponentEditorProps) {
  const selection = useFormItemSelection(components.length);
  const lowerTitle = title.toLowerCase();

  function saveComponent(index: number | null, component: VocabComponentRequest) {
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
      addLabel={`Add ${lowerTitle}`}
      emptyText={`No ${lowerTitle}s yet.`}
      getEditorTitle={(_, index, mode) =>
        mode === "add"
          ? `Add ${lowerTitle}`
          : `Editing ${lowerTitle} ${(index ?? 0) + 1}`
      }
      getRemoveConfirmTitle={(_, __, mode) =>
        mode === "add" ? `Discard this ${lowerTitle}?` : `Remove this ${lowerTitle}?`
      }
      getRemoveConfirmMessage={(_, __, mode) =>
        mode === "add"
          ? `This closes the modal without adding the ${lowerTitle}.`
          : `This removes the ${lowerTitle} from the form only. The change is saved when you submit.`
      }
      renderCard={(component, index, selected, onPress) => (
        <DetailLinkItem
          compact
          scrollContent
          primary={component.writing || `${title} ${index + 1}`}
          secondary={component.reading}
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
            label="Reading"
            value={component.reading ?? ""}
            onChangeText={(value) =>
              updateDraft({
                ...component,
                reading: value,
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
