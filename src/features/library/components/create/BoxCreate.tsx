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

export function BoxCreate({ type }: BoxCreateProps) {
  const router = useRouter();
  const createMutation = useCreateLibraryBox(type);

  const [form, setForm] = useState<BoxRequest>(() => createEmptyBoxForm());

  function handleCreate() {
    createMutation.mutate(cleanBoxForm(form), {
      onSuccess: (created) => {
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
