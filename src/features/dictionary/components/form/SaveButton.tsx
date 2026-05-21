import { Pressable, Text } from "react-native";

type SaveButtonProps = {
  loading?: boolean;
  label?: string;
  loadingLabel?: string;
  onPress: () => void;
};

export function SaveButton({
  loading,
  label = "Save",
  loadingLabel = "Saving...",
  onPress,
}: SaveButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      className="mt-4 rounded-xl bg-gray-900 px-4 py-4 disabled:opacity-60"
    >
      <Text className="text-center font-semibold text-white">
        {loading ? loadingLabel : label}
      </Text>
    </Pressable>
  );
}
