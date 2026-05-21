import { CenteredMessage } from "@/components/ui/CenteredMessage";
import { useLocalSearchParams } from "expo-router";
import { KanjiEdit } from "./components/edit/KanjiEdit";
import { VocabularyEdit } from "./components/edit/VocabularyEdit";

export default function LanguageEditPage() {
  const { type, id } = useLocalSearchParams<{
    type: string;
    id: string;
  }>();

  if (!id || !type) {
    return <CenteredMessage text="Missing language item id." />;
  }

  if (type === "KANJI") {
    return <KanjiEdit id={id} />;
  }

  if (type === "VOCABULARY") {
    return <VocabularyEdit id={id} />;
  }

  return <CenteredMessage text={`Unsupported language type: ${type}`} />;
}
