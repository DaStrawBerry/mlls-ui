import { ScrollView, Text, View } from "react-native";

import type { KanjiRequest } from "../../types/kanji";
import { FormTextInput } from "../FormTextInput";
import { LanguageSection } from "../detail/LanguageSection";
import { SaveButton } from "./SaveButton";
import { TagEditor } from "./TagEditor";

import { KanjiComponentEditor } from "./KanjiComponentEditor";
import { PronounceGroupEditor } from "./PronounceGroupEditor";

type KanjiFormProps = {
  title: string;
  form: KanjiRequest;
  onChange: (form: KanjiRequest) => void;
  onSubmit: () => void;
  submitting?: boolean;
  submitLabel?: string;
};

export function KanjiForm({
  title,
  form,
  onChange,
  onSubmit,
  submitting,
  submitLabel = "Save",
}: KanjiFormProps) {
  function updateField<K extends keyof KanjiRequest>(
    key: K,
    value: KanjiRequest[K],
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
            label="Sino"
            value={form.sino ?? ""}
            onChangeText={(value) => updateField("sino", value)}
          />

          <FormTextInput
            label="Meaning"
            value={form.meaning}
            onChangeText={(value) => updateField("meaning", value)}
            multiline
          />

          <FormTextInput
            label="Stroke"
            value={form.stroke ? String(form.stroke) : ""}
            onChangeText={(value) =>
              updateField("stroke", value ? Number(value) : undefined)
            }
            keyboardType="numeric"
          />

          <FormTextInput
            label="Level"
            value={form.level ?? ""}
            onChangeText={(value) =>
              updateField("level", value as KanjiRequest["level"])
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

        <LanguageSection title="Components">
          <KanjiComponentEditor
            components={form.components}
            onChange={(components) => updateField("components", components)}
          />
        </LanguageSection>

        <LanguageSection title="Kunyomi">
          <PronounceGroupEditor
            groups={form.kunyomi}
            onChange={(kunyomi) => updateField("kunyomi", kunyomi)}
          />
        </LanguageSection>

        <LanguageSection title="Onyomi">
          <PronounceGroupEditor
            groups={form.onyomi}
            onChange={(onyomi) => updateField("onyomi", onyomi)}
          />
        </LanguageSection>

        <SaveButton loading={submitting} onPress={onSubmit} />
      </View>
    </ScrollView>
  );
}
