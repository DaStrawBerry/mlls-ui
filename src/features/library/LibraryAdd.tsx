import { CenteredMessage } from "@/components/ui/CenteredMessage";
import { useLocalSearchParams } from "expo-router";
import { BoxCreate } from "./components/create/BoxCreate";
import { CellCreate } from "./components/create/CellCreate";
import type { LibGroupMode, LibMode } from "./types/memory";

function isGroupMode(type?: string): type is LibGroupMode {
  return type === "SHELF" || type === "STSET";
}

function isLibMode(type?: string): type is LibMode {
  return type === "SHELF" || type === "STSET" || type === "CELLS";
}

export default function LibraryAddPage() {
  const { type } = useLocalSearchParams<{
    type: string;
  }>();

  if (!type) {
    return <CenteredMessage text="Missing library type." />;
  }

  if (!isLibMode(type)) {
    return <CenteredMessage text={`Unsupported create type: ${type}`} />;
  }

  if (type === "CELLS") {
    return <CellCreate />;
  }

  if (isGroupMode(type)) {
    return <BoxCreate type={type} />;
  }

  return <CenteredMessage text={`Unsupported create type: ${type}`} />;
}
