import type { ReactNode } from "react";
import { Text, View } from "react-native";

type LanguageSectionProps = {
  title: string;
  children: ReactNode;
};

export function LanguageSection({ title, children }: LanguageSectionProps) {
  return (
    <View className="mt-4 rounded-2xl bg-white p-4">
      <Text className="mb-3 text-lg font-bold text-gray-900">{title}</Text>
      {children}
    </View>
  );
}
