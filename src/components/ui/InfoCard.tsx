import React from "react";

import { Card } from "@/components/ui/Card";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, View } from "react-native";

export type InfoCardBaseItem = {
  title?: string | null;
  subtitle?: string | null;
  badge?: string | null;
  content?: string | null;
};

type InfoCardHeaderProps = {
  title?: string | null;
  subtitle?: string | null;
  badge?: string | null;
  titleClassName?: string;
  subtitleClassName?: string;
};

function InfoCardHeader({
  title,
  subtitle,
  badge,
  titleClassName = "text-sm",
  subtitleClassName = "text-xs",
}: InfoCardHeaderProps) {
  return (
    <View className="flex-row items-start justify-between">
      <View className="flex-1 pr-3">
        {subtitle ? (
          <Text className={`${subtitleClassName} mb-1 text-gray-400`}>
            {subtitle}
          </Text>
        ) : null}

        <Text className={`${titleClassName} font-bold text-gray-900`}>
          {title || "Unknown"}
        </Text>
      </View>

      {badge ? (
        <Text className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
          {badge}
        </Text>
      ) : null}
    </View>
  );
}

type InfoCardContentProps = {
  content?: string | null;
  emptyText?: string;
};

function InfoCardContent({
  content,
  emptyText = "No content yet",
}: InfoCardContentProps) {
  if (!content) {
    return <Text className="text-base italic text-gray-400">{emptyText}</Text>;
  }

  return (
    <View className="relative max-w-full overflow-hidden">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="max-w-full"
        contentContainerStyle={{ flexGrow: 0 }}
      >
        <Text
          className="pr-8 text-base text-gray-700"
          style={{ flexShrink: 0 }}
        >
          {content}
        </Text>
      </ScrollView>

      <LinearGradient
        pointerEvents="none"
        colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="absolute bottom-0 right-0 top-0 w-10"
      />
    </View>
  );
}

export function ErrorInfoCard({
  message = "Error with input result.",
}: {
  message?: string;
}) {
  return (
    <Card className="mb-3">
      <Text className="text-base font-semibold text-red-500">{message}</Text>
    </Card>
  );
}

type InfoCardProps = {
  item: InfoCardBaseItem;

  titleClassName?: string;
  subtitleClassName?: string;

  emptyContentText?: string;
  className?: string;

  children?: React.ReactNode;
};

export function InfoCard({
  item,
  titleClassName,
  subtitleClassName,
  emptyContentText,
  className = "mb-3",
  children,
}: InfoCardProps) {
  return (
    <Card className={className}>
      <View className="gap-2">
        <InfoCardHeader
          title={item.title}
          subtitle={item.subtitle}
          badge={item.badge}
          titleClassName={titleClassName}
          subtitleClassName={subtitleClassName}
        />

        <InfoCardContent content={item.content} emptyText={emptyContentText} />

        {children}
      </View>
    </Card>
  );
}
