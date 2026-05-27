import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { CenteredMessage } from "@/components/ui/CenteredMessage";
import {
  useUpdateVocab,
  useVocabDetail,
} from "@/features/dictionary/hooks/useVocab";
import type { VocabRequest } from "@/features/dictionary/types/vocab";
import { cleanVocabForm, mapVocabResponseToForm } from "../../utils/vocabForm";
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
    setForm(mapVocabResponseToForm(query.data));
  }, [query.data]);

  if (query.isLoading || !form) {
    return <CenteredMessage text="Loading vocabulary editor..." />;
  }

  if (query.isError) {
    return <CenteredMessage text="Failed to load vocabulary." />;
  }

  function handleSave() {
    if (!form) return;

    updateMutation.mutate(
      {
        id,
        body: cleanVocabForm(form),
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
