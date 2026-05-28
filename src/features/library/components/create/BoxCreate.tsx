import { getErrorMessage, useToast } from "@/components/ui/Toast";
import { useRouter } from "expo-router";
import { useState } from "react";

import { useCreateLibraryBox } from "../../hooks/useLibraryBox";
import type { BoxRequest } from "../../types/box";
import type { LibGroupMode } from "../../types/memory";
import { BoxForm } from "../form/BoxForm";

type BoxCreateProps = {
  type: LibGroupMode;
};

function createEmptyBoxForm(): BoxRequest {
  return {
    name: "",
    slug: "",
    desc: "",
  };
}

function cleanBoxForm(form: BoxRequest): BoxRequest {
  return {
    name: form.name.trim(),
    slug: form.slug.trim(),
    desc: form.desc?.trim(),
  };
}

function getTitle(type: LibGroupMode) {
  if (type === "SHELF") return "Add Shelf";
  return "Add Study Set";
}

function getTypeLabel(type: LibGroupMode) {
  if (type === "SHELF") return "Shelf";
  return "Study set";
}

export function BoxCreate({ type }: BoxCreateProps) {
  const router = useRouter();
  const toast = useToast();
  const createMutation = useCreateLibraryBox(type);

  const [form, setForm] = useState<BoxRequest>(() => createEmptyBoxForm());

  function handleCreate() {
    const cleanForm = cleanBoxForm(form);

    if (!cleanForm.name || !cleanForm.slug) {
      toast.showWarning("Missing box info", "Name and slug are required.");
      return;
    }

    createMutation.mutate(cleanForm, {
      onSuccess: (created) => {
        toast.showSuccess(
          `${getTypeLabel(type)} created`,
          created.slug ? `${created.name} / ${created.slug}` : created.name,
        );
        router.replace({
          pathname: "/library/[type]/[id]",
          params: {
            type,
            id: created.id,
            name: created.name,
            slug: created.slug,
            desc: created.desc ?? "",
          },
        });
      },
      onError: (error) => {
        toast.showError("Create failed", getErrorMessage(error));
      },
    });
  }

  return (
    <BoxForm
      title={getTitle(type)}
      form={form}
      onChange={setForm}
      onSubmit={handleCreate}
      submitting={createMutation.isPending}
      submitLabel="Create"
    />
  );
}
