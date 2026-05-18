import { useEffect, useState } from "react";

import { getStudySets } from "@/features/library/api/studySetApi";
import { StudySet } from "@/features/library/types";

export function useStudySets() {
  const [data, setData] = useState<StudySet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    getStudySets()
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
