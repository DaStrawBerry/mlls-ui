import { Pressable, Text, View } from "react-native";

import type { KanjiPronounceRequest } from "@/features/dictionary/types/kanji";
import { FormTextInput } from "../FormTextInput";

type PronounceGroupEditorProps = {
  groups: KanjiPronounceRequest[];
  onChange: (groups: KanjiPronounceRequest[]) => void;
};

export function PronounceGroupEditor({
  groups,
  onChange,
}: PronounceGroupEditorProps) {
  function updateGroup(
    groupIndex: number,
    key: keyof KanjiPronounceRequest,
    value: KanjiPronounceRequest[keyof KanjiPronounceRequest],
  ) {
    onChange(
      groups.map((group, currentIndex) =>
        currentIndex === groupIndex
          ? {
              ...group,
              [key]: value,
            }
          : group,
      ),
    );
  }

  function addGroup() {
    onChange([
      ...groups,
      {
        pronounce: "",
        examples: [],
      },
    ]);
  }

  function removeGroup(groupIndex: number) {
    onChange(groups.filter((_, currentIndex) => currentIndex !== groupIndex));
  }

  function addExample(groupIndex: number) {
    onChange(
      groups.map((group, currentIndex) =>
        currentIndex === groupIndex
          ? {
              ...group,
              examples: [
                ...group.examples,
                {
                  writing: "",
                  reading: "",
                  meaning: "",
                },
              ],
            }
          : group,
      ),
    );
  }

  function removeExample(groupIndex: number, exampleIndex: number) {
    onChange(
      groups.map((group, currentIndex) =>
        currentIndex === groupIndex
          ? {
              ...group,
              examples: group.examples.filter(
                (_, currentExampleIndex) =>
                  currentExampleIndex !== exampleIndex,
              ),
            }
          : group,
      ),
    );
  }

  function updateExample(
    groupIndex: number,
    exampleIndex: number,
    key: "writing" | "reading" | "meaning",
    value: string,
  ) {
    onChange(
      groups.map((group, currentGroupIndex) =>
        currentGroupIndex === groupIndex
          ? {
              ...group,
              examples: group.examples.map((example, currentExampleIndex) =>
                currentExampleIndex === exampleIndex
                  ? {
                      ...example,
                      [key]: value,
                    }
                  : example,
              ),
            }
          : group,
      ),
    );
  }

  return (
    <View>
      {groups.map((group, groupIndex) => (
        <View
          key={groupIndex}
          className="mb-4 rounded-xl border border-gray-200 p-3"
        >
          <Text className="mb-3 font-bold text-gray-900">
            Pronounce group {groupIndex + 1}
          </Text>

          <FormTextInput
            label="Pronounce"
            value={group.pronounce}
            onChangeText={(value) =>
              updateGroup(groupIndex, "pronounce", value)
            }
          />

          <Text className="mb-3 mt-2 font-semibold text-gray-800">
            Examples
          </Text>

          {group.examples.map((example, exampleIndex) => (
            <View key={exampleIndex} className="mb-3 rounded-xl bg-gray-50 p-3">
              <Text className="mb-3 font-semibold text-gray-800">
                Example {exampleIndex + 1}
              </Text>

              <FormTextInput
                label="Writing"
                value={example.writing}
                onChangeText={(value) =>
                  updateExample(groupIndex, exampleIndex, "writing", value)
                }
              />

              <FormTextInput
                label="Reading"
                value={example.reading ?? ""}
                onChangeText={(value) =>
                  updateExample(groupIndex, exampleIndex, "reading", value)
                }
              />

              <FormTextInput
                label="Meaning"
                value={example.meaning ?? ""}
                onChangeText={(value) =>
                  updateExample(groupIndex, exampleIndex, "meaning", value)
                }
                multiline
              />

              <Pressable
                onPress={() => removeExample(groupIndex, exampleIndex)}
                className="rounded-xl bg-red-50 px-3 py-2"
              >
                <Text className="text-center font-semibold text-red-600">
                  Remove example
                </Text>
              </Pressable>
            </View>
          ))}

          <Pressable
            onPress={() => addExample(groupIndex)}
            className="mb-3 rounded-xl bg-gray-100 px-3 py-3"
          >
            <Text className="text-center font-semibold text-gray-800">
              + Add example
            </Text>
          </Pressable>

          <Pressable
            onPress={() => removeGroup(groupIndex)}
            className="rounded-xl bg-red-50 px-3 py-2"
          >
            <Text className="text-center font-semibold text-red-600">
              Remove pronounce group
            </Text>
          </Pressable>
        </View>
      ))}

      <Pressable
        onPress={addGroup}
        className="rounded-xl bg-gray-100 px-3 py-3"
      >
        <Text className="text-center font-semibold text-gray-800">
          + Add pronounce group
        </Text>
      </Pressable>
    </View>
  );
}
