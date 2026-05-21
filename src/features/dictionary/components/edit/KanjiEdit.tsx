import { CenteredMessage } from "@/components/ui/CenteredMessage";
import {
  useKanjiDetail,
  useUpdateKanji,
} from "@/features/dictionary/hooks/useKanji";
import { KanjiRequest } from "@/features/dictionary/types/kanji";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KanjiForm } from "../form/KanjiForm";

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

    const body: KanjiRequest = {
      ...form,
      tags: form.tags.map((tag) => tag.trim()).filter(Boolean),
      components: form.components.filter((component) =>
        component.writing.trim(),
      ),
      kunyomi: cleanPronounceGroups(form.kunyomi),
      onyomi: cleanPronounceGroups(form.onyomi),
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

  function cleanPronounceGroups(groups: KanjiRequest["kunyomi"]) {
    return groups
      .map((group) => ({
        ...group,
        pronounce: group.pronounce.trim(),
        examples: group.examples.filter((example) => example.writing.trim()),
      }))
      .filter((group) => group.pronounce || group.examples.length);
  }

  return (
    <KanjiForm
      title="Edit Kanji"
      form={form}
      onChange={setForm}
      onSubmit={handleSave}
      submitting={updateMutation.isPending}
      submitLabel="Save"
    />
  );
}
