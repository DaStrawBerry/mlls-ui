import { CenteredMessage } from "@/components/ui/CenteredMessage";
import { useLocalSearchParams } from "expo-router";
import { BoxCreate } from "./components/create/BoxCreate";
import type { LibGroupMode } from "./types/memory";

function isGroupMode(type?: string): type is LibGroupMode {
  return type === "SHELF" || type === "STSET";
}

export default function LibraryAddPage() {
  const { type } = useLocalSearchParams<{
    type: string;
  }>();

  if (!type) {
    return <CenteredMessage text="Missing library type." />;
  }

  if (isGroupMode(type)) {
    return <BoxCreate type={type} />;
  }

  return <CenteredMessage text={`Unsupported create type: ${type}`} />;
}
