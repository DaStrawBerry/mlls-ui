import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { CenteredMessage } from "@/components/ui/CenteredMessage";
import {
  useUpdateVocab,
  useVocabDetail,
} from "@/features/dictionary/hooks/useVocab";
import type { VocabRequest } from "@/features/dictionary/types/vocab";
import { FormTextInput } from "../FormTextInput";
import { LanguageSection } from "../detail/LanguageSection";
import { KanjiComponentEditor } from "../form/KanjiComponentEditor";
import { SaveButton } from "../form/SaveButton";
import { TagEditor } from "../form/TagEditor";
import { VocabComponentEditor } from "../form/VocabComponentEditor";
import { VocabularyForm } from "../form/VocabularyForm";

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

    const body: VocabRequest = {
      ...form,
      tags: form.tags.map((tag) => tag.trim()).filter(Boolean),
      kanjiComps: form.kanjiComps.filter((component) =>
        component.writing.trim(),
      ),
      vocabComps: form.vocabComps.filter((component) =>
        component.writing.trim(),
      ),
    };

    updateMutation.mutate(
      {
        id,
        body,
      },
      {
        onSuccess: () => {
          router.back();
        },
      },
    );
  }

  return (
    <VocabularyForm
      title="Edit Vocabulary"
      form={form}
      onChange={setForm}
      onSubmit={handleSave}
      submitting={updateMutation.isPending}
      submitLabel="Save"
    />
  );
}
