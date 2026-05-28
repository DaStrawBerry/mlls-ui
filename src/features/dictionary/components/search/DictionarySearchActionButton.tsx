// src/features/dictionary/components/search/DictionarySearchActionButton.tsx

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";

import {
  DictionaryMode,
  LanguageType,
  mapDictionaryModeToJpType,
} from "../../types/japanese";

export type DictionarySearchAction = "ADD" | "SYNC";

const ACTION_ICON: Record<DictionarySearchAction, keyof typeof Ionicons.glyphMap> = {
  ADD: "add",
  SYNC: "sync",
};

type DictionarySearchActionButtonProps = {
  mode: DictionaryMode;
  action: DictionarySearchAction;
  onSyncPress?: () => void;
};

export function DictionarySearchActionButton({
  mode,
  action,
  onSyncPress,
}: DictionarySearchActionButtonProps) {
  const router = useRouter();

  const safeType: LanguageType = mapDictionaryModeToJpType(mode);

  function handlePress() {
    if (action === "ADD") {
      router.push({
        pathname: "/language/[type]/add",
        params: {
          type: safeType,
        },
      });

      return;
    }

    onSyncPress?.();
  }

  return (
    <View className="flex-row">
      <Pressable
        onPress={handlePress}
        className={[
          "h-10 w-12 items-center justify-center rounded-xl active:bg-gray-700",
          action === "ADD" ? "bg-gray-900" : "bg-blue-600",
        ].join(" ")}
      >
        <Ionicons name={ACTION_ICON[action]} size={22} color="white" />
      </Pressable>
    </View>
  );
}