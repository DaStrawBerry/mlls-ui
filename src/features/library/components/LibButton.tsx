import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import type { LibMode } from "../types/memory";

type LibraryActionButtonsProps = {
  mode: LibMode;
};

export function LibraryActionButtons({ mode }: LibraryActionButtonsProps) {
  const router = useRouter();

  if (mode === "CELLS") {
    return <View />;
  }

  return (
    <View className="flex-row gap-2">
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/library/[type]/add",
            params: {
              type: mode,
            },
          })
        }
        className="rounded-xl bg-gray-900 p-2 px-3"
      >
        <Ionicons name="pencil" size={20} color="white" />
      </Pressable>
    </View>
  );
}
