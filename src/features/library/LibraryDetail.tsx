import { CenteredMessage } from "@/components/ui/CenteredMessage";
import { useLocalSearchParams } from "expo-router";
import { BoxDetail } from "./components/detail/BoxDetail";
import { CellDetail } from "./components/detail/CellDetail";
import type { BoxResponse } from "./types/box";
import type { LibGroupMode, LibMode } from "./types/memory";

function firstParam(value?: string | string[]) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function isLibMode(type?: string): type is LibMode {
  return type === "SHELF" || type === "STSET" || type === "CELLS";
}

function isGroupMode(type: LibMode): type is LibGroupMode {
  return type === "SHELF" || type === "STSET";
}

export default function LibraryDetailPage() {
  const params = useLocalSearchParams<{
    type: string;
    id: string;
    name?: string;
    slug?: string;
    desc?: string;
  }>();

  const type = firstParam(params.type);
  const id = firstParam(params.id);

  if (!id || !type) {
    return <CenteredMessage text="Missing library item id." />;
  }

  if (!isLibMode(type)) {
    return <CenteredMessage text={`Unsupported library type: ${type}`} />;
  }

  if (type === "CELLS") {
    return <CellDetail id={id} />;
  }

  if (isGroupMode(type)) {
    const box: BoxResponse = {
      id,
      name: firstParam(params.name) ?? "Unknown",
      slug: firstParam(params.slug) ?? "",
      desc: firstParam(params.desc) ?? "",
    };

    return <BoxDetail type={type} box={box} />;
  }

  return <CenteredMessage text={`Unsupported library type: ${type}`} />;
}
