import { CenteredMessage } from "@/components/ui/CenteredMessage";
import {
  useKanjiDetail,
  useUpdateKanji,
} from "@/features/dictionary/hooks/useKanji";
import { KanjiRequest } from "@/features/dictionary/types/kanji";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { FormTextInput } from "../FormTextInput";
import { LanguageSection } from "../detail/LanguageSection";

type KanjiEditProps = {
  id: string;
};

export function KanjiEdit({ id }: KanjiEditProps) {
  const router = useRouter();
  const query = useKanjiDetail(id);
  const updateMutation = useUpdateKanji();

  const [form, setForm] = useState<KanjiRequest | null>(null);

  useEffect(() => {
    if (!query.data) return;

    setForm({
      tags: query.data.tags ?? [],
      level: query.data.level,
      writing: query.data.writing ?? "",
      meaning: query.data.meaning ?? "",
      sino: query.data.sino ?? "",
      stroke: query.data.stroke,
      note: query.data.note ?? "",
      components:
        query.data.components?.map((component) => ({
          writing: component.writing ?? "",
          sino: component.sino ?? "",
        })) ?? [],
      kunyomi:
        query.data.kunyomi?.map((group) => ({
          pronounce: group.pronounce ?? "",
          examples:
            group.examples?.map((example) => ({
              writing: example.writing ?? "",
              reading: example.reading ?? "",
              meaning: example.meaning ?? "",
            })) ?? [],
        })) ?? [],
      onyomi:
        query.data.onyomi?.map((group) => ({
          pronounce: group.pronounce ?? "",
          examples:
            group.examples?.map((example) => ({
              writing: example.writing ?? "",
              reading: example.reading ?? "",
              meaning: example.meaning ?? "",
            })) ?? [],
        })) ?? [],
    });
  }, [query.data]);

  if (query.isLoading || !form) {
    return <CenteredMessage text="Loading kanji editor..." />;
  }

  if (query.isError) {
    return <CenteredMessage text="Failed to load kanji." />;
  }

  function updateField<K extends keyof KanjiRequest>(
    key: K,
    value: KanjiRequest[K],
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
          Edit Kanji
        </Text>

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
