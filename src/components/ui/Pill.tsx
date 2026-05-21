import { Text } from "react-native";

type PillProps = {
  text: string;
};

export function Pill({ text }: PillProps) {
  return (
    <Text className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
      {text}
    </Text>
  );
}
