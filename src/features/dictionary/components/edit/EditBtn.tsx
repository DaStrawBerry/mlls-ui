import { Ionicons } from "@expo/vector-icons";
import { Router } from "expo-router";
import { Pressable, View } from "react-native";
import { LanguageType } from "../../types/japanese";

type EditBtnProps = {
  id: string;
  router: Router;
  type?: LanguageType;
};

export function EditBtn({ id, router, type = "KANJI" }: EditBtnProps) {
  return (
    <View className="mb-3 flex-row justify-end">
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/language/[type]/[id]/edit",
            params: {
              type: type,
              id,
            },
          })
        }
        className="rounded-xl bg-gray-900 px-4 py-2"
      >
        <Ionicons name="pencil" size={20} color="white" />
      </Pressable>
    </View>
  );
}
