import { SearchActionButton } from "@/components/ui/SearchActionButton";
import { Ionicons } from "@expo/vector-icons";
import type { Router } from "expo-router";
import { Pressable, View } from "react-native";

import type { LanguageType } from "../../types/japanese";

type DictionaryDetailActionsProps = {
  id: string;
  type: LanguageType;
  router: Router;
  syncing?: boolean;
  onSync: () => void;
};

export function DictionaryDetailActions({
  id,
  type,
  router,
  syncing,
  onSync,
}: DictionaryDetailActionsProps) {
  return (
    <View className="mb-3 flex-row justify-end gap-2">
      <SearchActionButton
        action="sync"
        disabled={syncing}
        onPress={onSync}
      />

      <Pressable
        onPress={() =>
          router.push({
            pathname: "/language/[type]/[id]/edit",
            params: {
              type,
              id,
            },
          })
        }
        disabled={syncing}
        className="h-10 min-w-12 items-center justify-center rounded-xl bg-gray-900 px-3 active:bg-gray-700 disabled:opacity-50"
      >
        <Ionicons name="pencil" size={20} color="white" />
      </Pressable>
    </View>
  );
}
