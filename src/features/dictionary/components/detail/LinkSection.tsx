import type { ReactNode } from "react";

import { LanguageSection } from "./LanguageSection";

type LinkSectionProps<T> = {
  title: string;
  items?: T[];
  renderItem: (item: T) => ReactNode;
};

export function LinkSection<T>({
  title,
  items = [],
  renderItem,
}: LinkSectionProps<T>) {
  if (!items.length) return null;

  return (
    <LanguageSection title={title}>{items.map(renderItem)}</LanguageSection>
  );
}
