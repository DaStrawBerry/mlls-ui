import { CenteredMessage } from "@/components/ui/CenteredMessage";
import {
  useKanjiDetail,
  useUpdateKanji,
} from "@/features/dictionary/hooks/useKanji";
import { KanjiRequest } from "@/features/dictionary/types/kanji";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { cleanKanjiForm, mapKanjiResponseToForm } from "../../utils/kanjiForm";
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
    setForm(mapKanjiResponseToForm(query.data));
  }, [query.data]);

  if (query.isLoading || !form) {
    return <CenteredMessage text="Loading kanji editor..." />;
  }

  if (query.isError) {
    return <CenteredMessage text="Failed to load kanji." />;
  }

  function handleSave() {
    if (!form) return;

    updateMutation.mutate(
      {
        id,
        body: cleanKanjiForm(form),
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
