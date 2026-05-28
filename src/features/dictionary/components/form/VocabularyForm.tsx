import { ScrollView, Text, View } from "react-native";

import type { VocabRequest } from "../../types/vocab";
import { FormTextInput } from "../FormTextInput";
import { LanguageSection } from "../detail/LanguageSection";
import { SaveButton } from "./SaveButton";
import { TagEditor } from "./TagEditor";

import { VocabComponentEditor } from "./VocabComponentEditor";

type VocabularyFormProps = {
  title: string;
  form: VocabRequest;
  onChange: (form: VocabRequest) => void;
  onSubmit: () => void;
  submitting?: boolean;
  submitLabel?: string;
};

export function VocabularyForm({
  title,
  form,
  onChange,
  onSubmit,
  submitting,
  submitLabel = "Save",
}: VocabularyFormProps) {
  function updateField<K extends keyof VocabRequest>(
    key: K,
    value: VocabRequest[K],
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
            label="Writing"
            value={form.writing}
            onChangeText={(value) => updateField("writing", value)}
          />

          <FormTextInput
            label="Reading"
            value={form.reading}
            onChangeText={(value) => updateField("reading", value)}
          />

          <FormTextInput
            label="Meaning"
            value={form.meaning}
            onChangeText={(value) => updateField("meaning", value)}
            multiline
          />

          <FormTextInput
            label="Level"
            value={form.level ?? ""}
            onChangeText={(value) =>
              updateField("level", value as VocabRequest["level"])
            }
          />

          <FormTextInput
            label="Note"
            value={form.note ?? ""}
            onChangeText={(value) => updateField("note", value)}
            multiline
          />
        </LanguageSection>

        <LanguageSection title="Tags">
          <TagEditor
            tags={form.tags}
            onChange={(tags) => updateField("tags", tags)}
          />
        </LanguageSection>

        <LanguageSection title="Vocab components">
          <VocabComponentEditor
            title="Vocab component"
            components={form.vocabComps}
            onChange={(vocabComps) => updateField("vocabComps", vocabComps)}
          />
        </LanguageSection>

        <SaveButton
          loading={submitting}
          label={submitLabel}
          onPress={onSubmit}
        />
      </View>
    </ScrollView>
  );
}


