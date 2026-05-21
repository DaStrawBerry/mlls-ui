import { useRouter } from "expo-router";
import { useState } from "react";

import { useCreateVocab } from "../../hooks/useVocab";
import type { VocabRequest } from "../../types/vocab";

import {
  cleanVocabForm,
  createEmptyVocabForm,
} from "@/features/dictionary/utils/vocabForm";
import { VocabularyForm } from "../form/VocabularyForm";

export function VocabularyCreate() {
  const router = useRouter();
  const createMutation = useCreateVocab();

  const [form, setForm] = useState<VocabRequest>(() => createEmptyVocabForm());

  function handleCreate() {
    createMutation.mutate(cleanVocabForm(form), {
      onSuccess: (created) => {
        router.replace({
          pathname: "/language/[type]/[id]",
          params: {
            type: "VOCABULARY",
            id: created.id,
          },
        });
      },
    });
  }

  return (
    <VocabularyForm
      title="Add Vocabulary"
      form={form}
      onChange={setForm}
      onSubmit={handleCreate}
      submitting={createMutation.isPending}
      submitLabel="Create"
    />
  );
}
