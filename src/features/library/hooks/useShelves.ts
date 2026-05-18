import { useEffect, useState } from "react";

import { getShelves } from "@/features/library/api/shelfApi";
import { Shelf } from "@/features/library/types";

export function useShelves() {
  const [data, setData] = useState<Shelf[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    getShelves()
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
