import { useEffect, useState } from "react";

import { getAllKanji } from "@/features/dictionary/api/kanjiApi";
import { Kanji } from "@/features/dictionary/types";

export function useKanji() {
  const [data, setData] = useState<Kanji[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    getAllKanji()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return {
    data,
    error,
    loading,
  };
}
