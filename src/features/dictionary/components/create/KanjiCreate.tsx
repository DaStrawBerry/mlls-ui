import { useRouter } from "expo-router";
import { useState } from "react";

import { useCreateKanji } from "../../hooks/useKanji";
import type { KanjiRequest } from "../../types/kanji";

import { cleanKanjiForm, createEmptyKanjiForm } from "../../utils/kanjiForm";
import { KanjiForm } from "../form/KanjiForm";

export function KanjiCreate() {
  const router = useRouter();
  const createMutation = useCreateKanji();

  const [form, setForm] = useState<KanjiRequest>(() => createEmptyKanjiForm());

  function handleCreate() {
    createMutation.mutate(cleanKanjiForm(form), {
      onSuccess: (created) => {
        router.replace({
          pathname: "/language/[type]/[id]",
          params: {
            type: "KANJI",
            id: created.id,
          },
        });
      },
    });
  }

  return (
    <KanjiForm
      title="Add Kanji"
      form={form}
      onChange={setForm}
      onSubmit={handleCreate}
      submitting={createMutation.isPending}
      submitLabel="Create"
    />
  );
}
