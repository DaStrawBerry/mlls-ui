import { getErrorMessage, useToast } from "@/components/ui/Toast";
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
  const toast = useToast();

  const [form, setForm] = useState<VocabRequest>(() => createEmptyVocabForm());

  function handleCreate() {
    createMutation.mutate(cleanVocabForm(form), {
      onSuccess: (created) => {
        toast.showSuccess("Vocabulary created", created.writing);
        router.replace({
          pathname: "/language/[type]/[id]",
          params: {
            type: "VOCABULARY",
            id: created.id,
          },
        });
      },
      onError: (error) => {
        toast.showError("Create failed", getErrorMessage(error));
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
