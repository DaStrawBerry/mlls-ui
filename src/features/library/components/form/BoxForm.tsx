import { ScrollView, Text, View } from "react-native";

import { FormTextInput } from "@/features/dictionary/components/FormTextInput";
import { LanguageSection } from "@/features/dictionary/components/detail/LanguageSection";
import { SaveButton } from "@/features/dictionary/components/form/SaveButton";
import type { BoxRequest } from "../../types/box";

type BoxFormProps = {
  title: string;
  form: BoxRequest;
  onChange: (form: BoxRequest) => void;
  onSubmit: () => void;
  submitting?: boolean;
  submitLabel?: string;
};

export function BoxForm({
  title,
  form,
  onChange,
  onSubmit,
  submitting,
  submitLabel = "Save",
}: BoxFormProps) {
  function updateField<K extends keyof BoxRequest>(
    key: K,
    value: BoxRequest[K],
  ) {
    onChange({
      ...form,
      [key]: value,
    });
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4">
      <View className="py-4">
        <Text className="mb-4 text-2xl font-bold text-gray-900">{title}</Text>

        <LanguageSection title="Basic">
          <FormTextInput
            label="Name"
            value={form.name}
            onChangeText={(value) => updateField("name", value)}
            placeholder="Example: Japanese N5"
          />

          <FormTextInput
            label="Slug"
            value={form.slug}
            onChangeText={(value) => updateField("slug", value)}
            placeholder="Example: japanese-n5"
          />

          <FormTextInput
            label="Description"
            value={form.desc ?? ""}
            onChangeText={(value) => updateField("desc", value)}
            placeholder="Short note for this group"
            multiline
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
