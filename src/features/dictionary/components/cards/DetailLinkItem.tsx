import { Text } from "@react-navigation/elements";
import { Pressable } from "react-native";

export type DetailLinkItemProps = {
  primary?: string;
  secondary?: string;
  tertiary?: string;
  onPress?: () => void;
};

export function DetailLinkItem({
  primary,
  secondary,
  tertiary,
  onPress,
}: DetailLinkItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-2 rounded-xl border border-gray-200 bg-white px-4 py-3 active:bg-gray-100"
    >
      <Text className="text-lg font-semibold text-gray-900">
        {primary}
      </Text>

      {secondary ? (
        <Text className="mt-1 text-sm text-gray-500">
          {secondary}
        </Text>
      ) : null}

      {tertiary ? (
        <Text className="mt-1 text-sm text-gray-700">
          {tertiary}
        </Text>
      ) : null}
    </Pressable>
  );
}