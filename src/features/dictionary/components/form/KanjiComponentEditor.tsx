import { Pressable, Text, View } from "react-native";

import { FormTextInput } from "../FormTextInput"; 
import type { KanjiComponentRequest } from "../../types/kanji";

type KanjiComponentEditorProps = {
  components: KanjiComponentRequest[];
  onChange: (components: KanjiComponentRequest[]) => void;
};

export function KanjiComponentEditor({
  components,
  onChange,
}: KanjiComponentEditorProps) {
  function updateComponent(
    index: number,
    key: keyof KanjiComponentRequest,
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
        sino: "",
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
        <View key={index} className="mb-4 rounded-xl border border-gray-200 p-3">
          <Text className="mb-3 font-bold text-gray-900">
            Component {index + 1}
          </Text>

          <FormTextInput
            label="Writing"
            value={component.writing}
            onChangeText={(value) => updateComponent(index, "writing", value)}
          />

          <FormTextInput
            label="Sino"
            value={component.sino ?? ""}
            onChangeText={(value) => updateComponent(index, "sino", value)}
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
              Remove component
            </Text>
          </Pressable>
        </View>
      ))}

      <Pressable
        onPress={addComponent}
        className="rounded-xl bg-gray-100 px-3 py-3"
      >
        <Text className="text-center font-semibold text-gray-800">
          + Add component
        </Text>
      </Pressable>
    </View>
  );
}