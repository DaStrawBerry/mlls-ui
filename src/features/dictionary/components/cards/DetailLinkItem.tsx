import type { ReactNode } from "react";
import { Pressable, ScrollView, Text } from "react-native";

type OverflowTextProps = {
  children?: ReactNode;
  className: string;
  numberOfLines?: number;
  scroll?: boolean;
};

function OverflowText({
  children,
  className,
  numberOfLines,
  scroll = false,
}: OverflowTextProps) {
  if (!children) return null;

  if (!scroll) {
    return (
      <Text numberOfLines={numberOfLines} className={className}>
        {children}
      </Text>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="max-w-full"
      contentContainerStyle={{ flexGrow: 0 }}
    >
      <Text className={className} style={{ flexShrink: 0 }}>
        {children}
      </Text>
    </ScrollView>
  );
}

export type DetailLinkItemProps = {
  primary?: string;
  secondary?: string;
  tertiary?: string;
  compact?: boolean;
  scrollContent?: boolean;
  className?: string;
  onPress?: () => void;
};

export function DetailLinkItem({
  primary,
  secondary,
  tertiary,
  compact = false,
  scrollContent = false,
  className = "",
  onPress,
}: DetailLinkItemProps) {
  const shouldScrollContent = scrollContent || compact;

  return (
    <Pressable
      onPress={onPress}
      className={[
        "rounded-xl border border-gray-200 bg-white px-4 py-3 active:bg-gray-100",
        compact ? "min-h-24" : "mb-2",
        className,
      ].join(" ")}
    >
      <OverflowText
        scroll={shouldScrollContent}
        numberOfLines={compact ? 1 : undefined}
        className="text-lg font-semibold text-gray-900"
      >
        {primary}
      </OverflowText>

      {secondary ? (
        <OverflowText
          scroll={shouldScrollContent}
          numberOfLines={compact ? 1 : undefined}
          className="mt-1 text-sm text-gray-500"
        >
          {secondary}
        </OverflowText>
      ) : null}

      {tertiary ? (
        <OverflowText
          scroll={shouldScrollContent}
          numberOfLines={compact ? 2 : undefined}
          className="mt-1 text-sm text-gray-700"
        >
          {tertiary}
        </OverflowText>
      ) : null}
    </Pressable>
  );
}
