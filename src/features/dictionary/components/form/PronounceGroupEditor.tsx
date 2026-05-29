import { Text } from "react-native";

import type { KanjiPronounceRequest } from "@/features/dictionary/types/kanji";
import { DetailLinkItem } from "../cards/DetailLinkItem";
import { FormTextInput } from "../FormTextInput";
import { FormItemCarousel, useFormItemSelection } from "./FormItemCarousel";

type PronounceExample = KanjiPronounceRequest["examples"][number];

type PronounceGroupEditorProps = {
  groups: KanjiPronounceRequest[];
  onChange: (groups: KanjiPronounceRequest[]) => void;
};

type ExampleEditorProps = {
  examples: PronounceExample[];
  onChange: (examples: PronounceExample[]) => void;
};

function createEmptyExample(): PronounceExample {
  return {
    writing: "",
    reading: "",
    meaning: "",
  };
}

function createEmptyGroup(): KanjiPronounceRequest {
  return {
    pronounce: "",
    examples: [],
  };
}

function cloneGroup(group: KanjiPronounceRequest): KanjiPronounceRequest {
  return {
    ...group,
    examples: group.examples.map((example) => ({ ...example })),
  };
}

function ExampleEditor({ examples, onChange }: ExampleEditorProps) {
  const selection = useFormItemSelection(examples.length);

  function saveExample(index: number | null, example: PronounceExample) {
    if (index === null) {
      const nextExamples = [...examples, example];
      onChange(nextExamples);
      selection.selectLastAfterAdd(nextExamples.length);
      return;
    }

    onChange(
      examples.map((currentExample, currentIndex) =>
        currentIndex === index ? example : currentExample,
      ),
    );
    selection.setSelectedIndex(index);
  }

  function removeExample(index: number) {
    const nextExamples = examples.filter(
      (_, currentIndex) => currentIndex !== index,
    );
    onChange(nextExamples);
    selection.selectPreviousAfterRemove(nextExamples.length, index);
  }

  return (
    <FormItemCarousel
      items={examples}
      selectedIndex={selection.selectedIndex}
      onSelectIndex={selection.setSelectedIndex}
      createItem={createEmptyExample}
      onSaveItem={saveExample}
      onRemoveItem={removeExample}
      addLabel="Add example"
      emptyText="No examples yet. Add one if this reading needs examples."
      getEditorTitle={(_, index, mode) =>
        mode === "add" ? "Add example" : `Editing example ${(index ?? 0) + 1}`
      }
      getRemoveConfirmTitle={(_, __, mode) =>
        mode === "add" ? "Discard this example?" : "Remove this example?"
      }
      getRemoveConfirmMessage={(_, __, mode) =>
        mode === "add"
          ? "This closes the modal without adding the example."
          : "This removes the example from the form only. The change is saved when you submit."
      }
      renderCard={(example, index, selected, onPress) => (
        <DetailLinkItem
          compact
          scrollContent
          primary={example.writing || `Example ${index + 1}`}
          secondary={example.reading}
          tertiary={example.meaning}
          className={selected ? "border-blue-500 bg-blue-50" : ""}
          onPress={onPress}
        />
      )}
      renderEditor={(example, _, updateDraft) => (
        <>
          <FormTextInput
            label="Writing"
            value={example.writing}
            onChangeText={(value) =>
              updateDraft({
                ...example,
                writing: value,
              })
            }
          />

          <FormTextInput
            label="Reading"
            value={example.reading ?? ""}
            onChangeText={(value) =>
              updateDraft({
                ...example,
                reading: value,
              })
            }
          />

          <FormTextInput
            label="Meaning"
            value={example.meaning ?? ""}
            onChangeText={(value) =>
              updateDraft({
                ...example,
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

export function PronounceGroupEditor({
  groups,
  onChange,
}: PronounceGroupEditorProps) {
  const selection = useFormItemSelection(groups.length);

  function saveGroup(index: number | null, group: KanjiPronounceRequest) {
    if (index === null) {
      const nextGroups = [...groups, group];
      onChange(nextGroups);
      selection.selectLastAfterAdd(nextGroups.length);
      return;
    }

    onChange(
      groups.map((currentGroup, currentIndex) =>
        currentIndex === index ? group : currentGroup,
      ),
    );
    selection.setSelectedIndex(index);
  }

  function removeGroup(groupIndex: number) {
    const nextGroups = groups.filter(
      (_, currentIndex) => currentIndex !== groupIndex,
    );
    onChange(nextGroups);
    selection.selectPreviousAfterRemove(nextGroups.length, groupIndex);
  }

  return (
    <FormItemCarousel
      items={groups}
      selectedIndex={selection.selectedIndex}
      onSelectIndex={selection.setSelectedIndex}
      createItem={createEmptyGroup}
      cloneItem={cloneGroup}
      onSaveItem={saveGroup}
      onRemoveItem={removeGroup}
      addLabel="Add pronounce group"
      emptyText="No pronounce groups yet. Add kunyomi/onyomi data if available."
      getEditorTitle={(_, index, mode) =>
        mode === "add"
          ? "Add pronounce group"
          : `Editing pronounce group ${(index ?? 0) + 1}`
      }
      getRemoveConfirmTitle={(_, __, mode) =>
        mode === "add"
          ? "Discard this pronounce group?"
          : "Remove this pronounce group?"
      }
      getRemoveConfirmMessage={(_, __, mode) =>
        mode === "add"
          ? "This closes the modal without adding the pronounce group."
          : "This removes the pronounce group and its examples from the form only. The change is saved when you submit."
      }
      renderCard={(group, index, selected, onPress) => (
        <DetailLinkItem
          compact
          scrollContent
          primary={group.pronounce || `Pronounce ${index + 1}`}
          secondary={`${group.examples.length} example${
            group.examples.length === 1 ? "" : "s"
          }`}
          className={selected ? "border-blue-500 bg-blue-50" : ""}
          onPress={onPress}
        />
      )}
      renderEditor={(group, _, updateDraft) => (
        <>
          <FormTextInput
            label="Pronounce"
            value={group.pronounce}
            onChangeText={(value) =>
              updateDraft({
                ...group,
                pronounce: value,
              })
            }
          />

          <Text className="mb-3 mt-2 font-semibold text-gray-800">
            Examples
          </Text>

          <ExampleEditor
            examples={group.examples}
            onChange={(examples) =>
              updateDraft({
                ...group,
                examples,
              })
            }
          />
        </>
      )}
    />
  );
}
