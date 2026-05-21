import { Text, View } from "react-native";

type CenteredMessageProps = {
  text: string;
};

export function CenteredMessage({ text }: CenteredMessageProps) {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50 p-4">
      <Text className="text-center text-base text-gray-600">{text}</Text>
    </View>
  );
}
