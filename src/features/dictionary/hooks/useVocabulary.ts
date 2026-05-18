import { useEffect, useState } from "react";

import { getAllVocabulary } from "@/features/dictionary/api/vocabularyApi";
import { Vocabulary } from "@/features/dictionary/types";

export function useVocabulary() {
  const [data, setData] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    getAllVocabulary()
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
