import { Pressable, Text, View } from "react-native";

import { FormTextInput } from "../FormTextInput";

type TagEditorProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
};

export function TagEditor({ tags, onChange }: TagEditorProps) {
  function updateTag(index: number, value: string) {
    onChange(
      tags.map((tag, currentIndex) => (currentIndex === index ? value : tag)),
    );
  }

  function removeTag(index: number) {
    onChange(tags.filter((_, currentIndex) => currentIndex !== index));
  }

  function addTag() {
    onChange([...tags, ""]);
  }

  return (
    <View>
      {tags.map((tag, index) => (
        <View
          key={index}
          className="mb-3 rounded-xl border border-gray-200 p-3"
        >
          <FormTextInput
            label={`Tag ${index + 1}`}
            value={tag}
            onChangeText={(value) => updateTag(index, value)}
          />

          <Pressable
            onPress={() => removeTag(index)}
            className="rounded-xl bg-red-50 px-3 py-2"
          >
            <Text className="text-center font-semibold text-red-600">
              Remove tag
            </Text>
          </Pressable>
        </View>
      ))}

      <Pressable onPress={addTag} className="rounded-xl bg-gray-100 px-3 py-3">
        <Text className="text-center font-semibold text-gray-800">
          + Add tag
        </Text>
      </Pressable>
    </View>
  );
}
