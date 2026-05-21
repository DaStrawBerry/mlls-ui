import { useLocalSearchParams } from "expo-router";

import { CenteredMessage } from "@/components/ui/CenteredMessage";
import { KanjiCreate } from "./components/create/KanjiCreate";
import { VocabularyCreate } from "./components/create/VocabularyCreate";

export default function LanguageAddPage() {
  const { type } = useLocalSearchParams<{
    type: string;
  }>();

  if (!type) {
    return <CenteredMessage text="Missing language type." />;
  }

  if (type === "KANJI") {
    return <KanjiCreate />;
  }

  if (type === "VOCABULARY") {
    return <VocabularyCreate />;
  }

  return <CenteredMessage text={`Unsupported language type: ${type}`} />;
}
