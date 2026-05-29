import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { FloatingModal } from "@/components/ui/FloatingModal";
import { confirmAction } from "@/utils/confirmAction";

type FormEditorMode = "add" | "edit";

type EditorState<TItem> = {
  mode: FormEditorMode;
  index: number | null;
  draft: TItem;
};

type FormItemCarouselProps<TItem> = {
  items: TItem[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  createItem: () => TItem;
  onSaveItem: (index: number | null, item: TItem) => void;
  onRemoveItem: (index: number) => void;
  addLabel: string;
  emptyText?: string;
  keyExtractor?: (item: TItem, index: number) => string;
  cloneItem?: (item: TItem) => TItem;
  getEditorTitle: (
    item: TItem,
    index: number | null,
    mode: FormEditorMode,
  ) => string;
  getRemoveConfirmTitle: (
    item: TItem,
    index: number | null,
    mode: FormEditorMode,
  ) => string;
  getRemoveConfirmMessage?: (
    item: TItem,
    index: number | null,
    mode: FormEditorMode,
  ) => string;
  renderCard: (
    item: TItem,
    index: number,
    selected: boolean,
    onPress: () => void,
  ) => ReactNode;
  renderEditor: (
    item: TItem,
    index: number | null,
    updateDraft: (item: TItem) => void,
  ) => ReactNode;
};

export function useFormItemSelection(itemCount: number) {
  const [selectedIndex, setSelectedIndex] = useState(itemCount > 0 ? 0 : -1);

  useEffect(() => {
    setSelectedIndex((current) => {
      if (itemCount <= 0) return -1;
      if (current < 0) return 0;
      if (current >= itemCount) return itemCount - 1;
      return current;
    });
  }, [itemCount]);

  function selectLastAfterAdd(nextCount: number) {
    setSelectedIndex(Math.max(nextCount - 1, 0));
  }

  function selectPreviousAfterRemove(nextCount: number, removedIndex: number) {
    if (nextCount <= 0) {
      setSelectedIndex(-1);
      return;
    }

    setSelectedIndex(Math.min(removedIndex, nextCount - 1));
  }

  return {
    selectedIndex,
    setSelectedIndex,
    selectLastAfterAdd,
    selectPreviousAfterRemove,
  };
}

function defaultCloneItem<TItem>(item: TItem): TItem {
  if (Array.isArray(item)) {
    return [...item] as TItem;
  }

  if (item && typeof item === "object") {
    return { ...(item as object) } as TItem;
  }

  return item;
}

export function FormEditorHeader({
  title,
  removeLabel = "Remove",
  confirmTitle,
  confirmMessage,
  onRemove,
}: {
  title: string;
  removeLabel?: string;
  confirmTitle: string;
  confirmMessage?: string;
  onRemove: () => void;
}) {
  function handleRemove() {
    confirmAction({
      title: confirmTitle,
      message: confirmMessage,
      confirmText: "Remove",
      destructive: true,
      onConfirm: onRemove,
    });
  }

  return (
    <View className="mb-3 flex-row items-start justify-between gap-3">
      <Text className="min-w-0 flex-1 font-bold text-gray-900">{title}</Text>

      <Pressable
        onPress={handleRemove}
        className="flex-row items-center gap-1 rounded-xl bg-red-50 px-3 py-2 active:bg-red-100"
      >
        <Ionicons name="trash-outline" size={16} color="#DC2626" />
        <Text className="text-sm font-semibold text-red-600">
          {removeLabel}
        </Text>
      </Pressable>
    </View>
  );
}

export function FormItemCarousel<TItem>({
  items,
  selectedIndex,
  onSelectIndex,
  createItem,
  onSaveItem,
  onRemoveItem,
  addLabel,
  emptyText = "No items yet.",
  keyExtractor,
  cloneItem = defaultCloneItem,
  getEditorTitle,
  getRemoveConfirmTitle,
  getRemoveConfirmMessage,
  renderCard,
  renderEditor,
}: FormItemCarouselProps<TItem>) {
  const [editorState, setEditorState] = useState<EditorState<TItem> | null>(
    null,
  );

  useEffect(() => {
    if (!editorState || editorState.mode === "add") return;

    if (editorState.index === null || editorState.index >= items.length) {
      setEditorState(null);
    }
  }, [editorState, items.length]);

  function closeEditor() {
    setEditorState(null);
  }

  function openAddEditor() {
    setEditorState({
      mode: "add",
      index: null,
      draft: createItem(),
    });
  }

  function openEditEditor(index: number) {
    const item = items[index];
    if (!item) return;

    onSelectIndex(index);
    setEditorState({
      mode: "edit",
      index,
      draft: cloneItem(item),
    });
  }

  function updateDraft(nextDraft: TItem) {
    setEditorState((current) => {
      if (!current) return current;

      return {
        ...current,
        draft: nextDraft,
      };
    });
  }

  function handleProceed() {
    if (!editorState) return;

    const { mode, index, draft } = editorState;
    onSaveItem(index, draft);

    if (mode === "add") {
      onSelectIndex(items.length);
    } else if (index !== null) {
      onSelectIndex(index);
    }

    closeEditor();
  }

  function handleRemove() {
    if (!editorState) return;

    const { mode, index } = editorState;

    if (mode === "add" || index === null) {
      closeEditor();
      return;
    }

    onRemoveItem(index);
    closeEditor();
  }

  const proceedLabel = editorState?.mode === "add" ? "Add" : "Update";

  return (
    <View>
      <View className="mb-3 flex-row items-center justify-between gap-3">
        <Text className="text-sm font-semibold text-gray-500">
          {items.length} item{items.length === 1 ? "" : "s"}
        </Text>

        <Pressable
          onPress={openAddEditor}
          className="rounded-xl bg-gray-100 px-3 py-2 active:bg-gray-200"
        >
          <Text className="text-sm font-semibold text-gray-800">
            + {addLabel}
          </Text>
        </Pressable>
      </View>

      {items.length ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="-mx-1"
          contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
        >
          {items.map((item, index) => {
            const selected = index === selectedIndex;

            return (
              <View
                key={keyExtractor?.(item, index) ?? String(index)}
                className="w-48"
              >
                {renderCard(item, index, selected, () => openEditEditor(index))}
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4">
          <Text className="text-center text-sm text-gray-500">{emptyText}</Text>
        </View>
      )}

      <FloatingModal visible={!!editorState} priority={100}>
        <View className="mb-3 flex-row justify-end">
          <Pressable
            onPress={closeEditor}
            className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
          >
            <Ionicons name="close" size={20} color="#111827" />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {editorState ? (
            <>
              <FormEditorHeader
                title={getEditorTitle(
                  editorState.draft,
                  editorState.index,
                  editorState.mode,
                )}
                removeLabel={editorState.mode === "add" ? "Discard" : "Remove"}
                confirmTitle={getRemoveConfirmTitle(
                  editorState.draft,
                  editorState.index,
                  editorState.mode,
                )}
                confirmMessage={getRemoveConfirmMessage?.(
                  editorState.draft,
                  editorState.index,
                  editorState.mode,
                )}
                onRemove={handleRemove}
              />

              {renderEditor(editorState.draft, editorState.index, updateDraft)}
            </>
          ) : null}
        </ScrollView>

        <View className="mt-4 flex-row justify-end gap-2">
          <Pressable
            onPress={closeEditor}
            className="rounded-xl bg-gray-100 px-4 py-3 active:bg-gray-200"
          >
            <Text className="font-semibold text-gray-700">Close</Text>
          </Pressable>

          <Pressable
            onPress={handleProceed}
            className="rounded-xl bg-gray-900 px-4 py-3 active:bg-gray-700"
          >
            <Text className="font-bold text-white">{proceedLabel}</Text>
          </Pressable>
        </View>
      </FloatingModal>
    </View>
  );
}
