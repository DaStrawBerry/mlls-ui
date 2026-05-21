import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { LanguageType } from "../../types/japanese";

function mapToLanguageType(
  value: string | any | undefined | null,
): LanguageType {
  switch (value) {
    case "KANJI":
      return "KANJI";

    case "GRAMA":
      return "GRAMMAR";

    default:
      return "VOCABULARY";
  }
}

export function AddLanguageButtons(type: any) {
  const router = useRouter();

  const safeType: LanguageType = mapToLanguageType(type);

  return (
    <View className="flex-row gap-2">
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/language/[type]/add",
            params: {
              type: safeType,
            },
          })
        }
        className="flex-1 rounded-xl bg-gray-900 px-4 py-3"
      >
        <Ionicons name="pencil" size={20} color="white" />
      </Pressable>
    </View>
  );
}
