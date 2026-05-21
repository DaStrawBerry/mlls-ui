import { Pressable, Text, View } from "react-native";

import type { VocabComponentRequest } from "@/features/dictionary/types/vocab";
import { FormTextInput } from "../FormTextInput";

type VocabComponentEditorProps = {
  title?: string;
  components: VocabComponentRequest[];
  onChange: (components: VocabComponentRequest[]) => void;
};

export function VocabComponentEditor({
  title = "Component",
  components,
  onChange,
}: VocabComponentEditorProps) {
  function updateComponent(
    index: number,
    key: keyof VocabComponentRequest,
    value: string,
  ) {
    onChange(
      components.map((component, currentIndex) =>
        currentIndex === index
          ? {
              ...component,
              [key]: value,
            }
          : component,
      ),
    );
  }

  function addComponent() {
    onChange([
      ...components,
      {
        writing: "",
        reading: "",
        meaning: "",
      },
    ]);
  }

  function removeComponent(index: number) {
    onChange(components.filter((_, currentIndex) => currentIndex !== index));
  }

  return (
    <View>
      {components.map((component, index) => (
        <View
          key={index}
          className="mb-4 rounded-xl border border-gray-200 p-3"
        >
          <Text className="mb-3 font-bold text-gray-900">
            {title} {index + 1}
          </Text>

          <FormTextInput
            label="Writing"
            value={component.writing}
            onChangeText={(value) => updateComponent(index, "writing", value)}
          />

          <FormTextInput
            label="Reading"
            value={component.reading ?? ""}
            onChangeText={(value) => updateComponent(index, "reading", value)}
          />

          <FormTextInput
            label="Meaning"
            value={component.meaning ?? ""}
            onChangeText={(value) => updateComponent(index, "meaning", value)}
            multiline
          />

          <Pressable
            onPress={() => removeComponent(index)}
            className="rounded-xl bg-red-50 px-3 py-2"
          >
            <Text className="text-center font-semibold text-red-600">
              Remove {title.toLowerCase()}
            </Text>
          </Pressable>
        </View>
      ))}

      <Pressable
        onPress={addComponent}
        className="rounded-xl bg-gray-100 px-3 py-3"
      >
        <Text className="text-center font-semibold text-gray-800">
          + Add {title.toLowerCase()}
        </Text>
      </Pressable>
    </View>
  );
}
