import { getKanji } from "@/api/language/kanji";
import { useQuery } from "@tanstack/react-query";

export function useVocabulary(page = 0, size = 20) {
  return useQuery({
    queryKey: ["knowledge", page, size],
    queryFn: () => getKanji(page, size),
  });
}
