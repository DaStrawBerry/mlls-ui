import { CycleSelector } from "@/components/ui/CycleSelector";
import { FormTextInput } from "@/features/dictionary/components/FormTextInput";
import { LanguageSection } from "@/features/dictionary/components/detail/LanguageSection";
import { SaveButton } from "@/features/dictionary/components/form/SaveButton";
import { Pressable, ScrollView, Text, View } from "react-native";

import type { BoxRequest, BoxResponse } from "../../types/box";
import type { CellRequest } from "../../types/cell";
import type { LibGroupMode } from "../../types/memory";

const TARGET_OPTIONS = [
  { label: "SHELF", value: "SHELF" },
  { label: "STSET", value: "STSET" },
] as const;

type CellFormProps = {
  title: string;
  cell: CellRequest;
  box: BoxRequest;
  targetMode: LibGroupMode;
  selectedBox?: Pick<BoxResponse, "id" | "name" | "slug"> | null;
  onCellChange: (cell: CellRequest) => void;
  onBoxChange: (box: BoxRequest) => void;
  onTargetModeChange: (mode: LibGroupMode) => void;
  onOpenBoxPicker: () => void;
  onSubmit: () => void;
  submitting?: boolean;
  submitLabel?: string;
};

function getTargetLabel(mode: LibGroupMode) {
  if (mode === "SHELF") return "Shelf";
  return "Study Set";
}

export function CellForm({
  title,
  cell,
  box,
  targetMode,
  selectedBox,
  onCellChange,
  onBoxChange,
  onTargetModeChange,
  onOpenBoxPicker,
  onSubmit,
  submitting,
  submitLabel = "Save",
}: CellFormProps) {
  function updateCell<K extends keyof CellRequest>(
    key: K,
    value: CellRequest[K],
  ) {
    onCellChange({
      ...cell,
      [key]: value,
    });
  }

  function updateBox<K extends keyof BoxRequest>(key: K, value: BoxRequest[K]) {
    onBoxChange({
      ...box,
      [key]: value,
    });
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4">
      <View className="py-4">
        <Text className="mb-4 text-2xl font-bold text-gray-900">{title}</Text>

        <LanguageSection title="Cell">
          <FormTextInput
            label="Front"
            value={cell.front}
            onChangeText={(value) => updateCell("front", value)}
            placeholder="Question / front side"
            multiline
          />

          <FormTextInput
            label="Back"
            value={cell.back}
            onChangeText={(value) => updateCell("back", value)}
            placeholder="Answer / back side"
            multiline
          />

          <FormTextInput
            label="External"
            value={cell.external ?? ""}
            onChangeText={(value) => updateCell("external", value)}
          />

          <FormTextInput
            label="Source type"
            value={cell.sourceType ?? ""}
            onChangeText={(value) => updateCell("sourceType", value)}
          />

          <FormTextInput
            label="Source id"
            value={cell.sourceId ?? ""}
            onChangeText={(value) => updateCell("sourceId", value)}
          />

          <FormTextInput
            label="Metadata"
            value={cell.metadata ?? ""}
            onChangeText={(value) => updateCell("metadata", value)}
            multiline
          />
        </LanguageSection>

        <LanguageSection title="Target box">
          <View className="mb-4 flex-row items-center justify-between">
            <CycleSelector
              label="Target: "
              value={targetMode}
              options={[...TARGET_OPTIONS]}
              onChange={onTargetModeChange}
              width={140}
            />

            <Pressable
              onPress={onOpenBoxPicker}
              className="rounded-xl bg-gray-900 px-4 py-3"
            >
              <Text className="font-semibold text-white">Search box</Text>
            </Pressable>
          </View>

          {selectedBox ? (
            <View className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 p-3">
              <Text className="text-xs font-bold uppercase text-blue-500">
                Selected {getTargetLabel(targetMode)}
              </Text>
              <Text className="mt-1 text-lg font-bold text-blue-950">
                {selectedBox.name || "Unnamed"}
              </Text>
              {selectedBox.slug ? (
                <Text className="mt-1 text-sm font-semibold text-blue-700">
                  {selectedBox.slug}
                </Text>
              ) : null}
            </View>
          ) : (
            <View className="mb-4 rounded-2xl border border-amber-100 bg-amber-50 p-3">
              <Text className="text-sm font-semibold text-amber-800">
                No saved {getTargetLabel(targetMode).toLowerCase()} selected
                yet.
              </Text>
              <Text className="mt-1 text-xs text-amber-700">
                Search and select one. The selected id is used for API actions.
              </Text>
            </View>
          )}

          <FormTextInput
            label="Box name"
            value={box.name}
            onChangeText={(value) => updateBox("name", value)}
            placeholder="Example: Japanese N5"
          />

          <FormTextInput
            label="Box slug"
            value={box.slug}
            onChangeText={(value) => updateBox("slug", value)}
            placeholder="Example: japanese-n5"
          />
        </LanguageSection>

        <SaveButton
          loading={submitting}
          label={submitLabel}
          loadingLabel="Creating..."
          onPress={onSubmit}
        />
      </View>
    </ScrollView>
  );
}
