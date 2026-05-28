import { useCallback, useMemo, useState } from "react";

type SelectableItem = {
  id: string;
};

export function useMultiSelect<TItem extends SelectableItem>() {
  const [selectedById, setSelectedById] = useState<Record<string, TItem>>({});

  const selectedItems = useMemo(
    () => Object.values(selectedById),
    [selectedById],
  );

  const selectedIds = useMemo(
    () => selectedItems.map((item) => item.id),
    [selectedItems],
  );

  const selectedCount = selectedIds.length;

  const clearSelected = useCallback(() => {
    setSelectedById({});
  }, []);

  const toggleSelected = useCallback((item: TItem) => {
    setSelectedById((current) => {
      const next = { ...current };

      if (next[item.id]) {
        delete next[item.id];
        return next;
      }

      next[item.id] = item;
      return next;
    });
  }, []);

  return {
    selectedItems,
    selectedIds,
    selectedCount,
    toggleSelected,
    clearSelected,
  };
}
