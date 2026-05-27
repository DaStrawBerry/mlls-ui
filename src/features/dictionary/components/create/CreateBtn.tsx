import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { LanguageType, mapDictionaryModeToJpType } from "../../types/japanese";
import { DictionaryMode } from "../../types/japanese";

type AddLanguageButtonsProps = {
  type?: DictionaryMode;
};

export function AddLanguageButtons({ type }: AddLanguageButtonsProps){
  const router = useRouter();

  const safeType: LanguageType = mapDictionaryModeToJpType(type);

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
