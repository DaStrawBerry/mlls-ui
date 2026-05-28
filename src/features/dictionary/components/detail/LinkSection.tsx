import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";

import { LanguageSection } from "./LanguageSection";

type LinkSectionProps<T> = {
  title: string;
  items?: T[];
  keyExtractor?: (item: T, index: number) => string;
  renderItem: (item: T) => ReactNode;
};

export function LinkSection<T>({
  title,
  items = [],
  keyExtractor,
  renderItem,
}: LinkSectionProps<T>) {
  if (!items.length) return null;

  return (
    <LanguageSection title={title}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-1"
        contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
      >
        {items.map((item, index) => (
          <View
            key={keyExtractor?.(item, index) ?? String(index)}
            className="w-44"
          >
            {renderItem(item)}
          </View>
        ))}
      </ScrollView>
    </LanguageSection>
  );
}
