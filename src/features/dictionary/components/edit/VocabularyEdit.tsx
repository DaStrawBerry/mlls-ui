import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { CenteredMessage } from "@/components/ui/CenteredMessage";
import {
  useUpdateVocab,
  useVocabDetail,
} from "@/features/dictionary/hooks/useVocab";
import type { VocabRequest } from "@/features/dictionary/types/vocab";
import { FormTextInput } from "../FormTextInput";
import { LanguageSection } from "../detail/LanguageSection";

type VocabularyEditProps = {
  id: string;
};

export function VocabularyEdit({ id }: VocabularyEditProps) {
  const router = useRouter();
  const query = useVocabDetail(id);
  const updateMutation = useUpdateVocab();

  const [form, setForm] = useState<VocabRequest | null>(null);

  useEffect(() => {
    if (!query.data) return;

    setForm({
      tags: query.data.tags ?? [],
      level: query.data.level,
      writing: query.data.writing ?? "",
      reading: query.data.reading ?? "",
      meaning: query.data.meaning ?? "",
      note: query.data.note ?? "",
      kanjiComps:
        query.data.kanjiComponents?.map((component) => ({
          writing: component.writing ?? "",
          sino: component.sino ?? "",
        })) ?? [],
      vocabComps:
        query.data.vocabComponents?.map((component) => ({
          writing: component.writing ?? "",
          reading: component.reading ?? "",
          meaning: component.meaning ?? "",
        })) ?? [],
      pronounces: [],
    });
  }, [query.data]);

  if (query.isLoading || !form) {
    return <CenteredMessage text="Loading vocabulary editor..." />;
  }

  if (query.isError) {
    return <CenteredMessage text="Failed to load vocabulary." />;
  }

  function updateField<K extends keyof VocabRequest>(
    key: K,
    value: VocabRequest[K],
  ) {
    setForm((current) => {
      if (!current) return current;
      return {
        ...current,
        [key]: value,
      };
    });
  }

  function handleSave() {
    if (!form) return;

    updateMutation.mutate(
      {
        id,
        body: form,
      },
      {
        onSuccess: () => {
          router.back();
        },
      },
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4">
      <View className="py-4">
        <Text className="mb-4 text-2xl font-bold text-gray-900">
          Edit Vocabulary
        </Text>

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

          <FormTextInput
            label="Tags"
            value={form.tags.join(", ")}
            onChangeText={(value) =>
              updateField(
                "tags",
                value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              )
            }
          />
        </LanguageSection>

        <Pressable
          onPress={handleSave}
          disabled={updateMutation.isPending}
          className="mt-4 rounded-xl bg-gray-900 px-4 py-4"
        >
          <Text className="text-center font-semibold text-white">
            {updateMutation.isPending ? "Saving..." : "Save"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
