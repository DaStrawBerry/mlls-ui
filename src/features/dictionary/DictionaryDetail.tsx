import { CenteredMessage } from "@/components/ui/CenteredMessage";
import { useLocalSearchParams } from "expo-router";
import { KanjiDetail } from "./components/detail/KanjiDetail";
import { VocabularyDetail } from "./components/detail/VocabularyDetail";

export default function LanguageDetailPage() {
  const { type, id } = useLocalSearchParams<{
    type: string;
    id: string;
  }>();

  if (!id || !type) {
    return <CenteredMessage text="Missing language item id." />;
  }

  if (type === "KANJI") {
    return <KanjiDetail id={id} />;
  }

  if (type === "VOCABULARY") {
    return <VocabularyDetail id={id} />;
  }

  return <CenteredMessage text={`Unsupported language type: ${type}`} />;
}
