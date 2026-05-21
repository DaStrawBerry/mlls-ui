import React from "react";

import { Card } from "@/components/ui/Card";
import type { LanguageResponse } from "@/features/dictionary/types/japanese";
import type { KanjiResponse } from "@/features/dictionary/types/kanji";
import type { VocabResponse } from "@/features/dictionary/types/vocab";

import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, View } from "react-native";

type DictionaryBaseItem = {
  writing?: string | null;
  level?: string | null;
  meaning?: string | null;
  type?: string | null;
};

function ErrorCard() {
  return (
    <Card className="mb-3">
      <Text className="text-base font-semibold text-red-500">
        Error with input result.
      </Text>
    </Card>
  );
}

type CardHeaderProps = {
  writing?: string | null;
  subWriting?: string | null;
  level?: string | null;
  subwritingClassName?: string;
  writingClassName?: string;
};

function CardHeader({
  writing,
  subWriting,
  level,
  subwritingClassName = "text-xs",
  writingClassName = "text-sm",
}: CardHeaderProps) {
  return (
    <View className="flex-row items-start justify-between">
      <View>
        {subWriting ? (
          <Text className={`${subwritingClassName} mb-1 text-gray-400`}>
            {subWriting}
          </Text>
        ) : null}

        <Text className={`${writingClassName} font-bold text-gray-900`}>
          {writing || "Unknown"}
        </Text>
      </View>

      {level ? (
        <Text className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
          {level}
        </Text>
      ) : null}
    </View>
  );
}

function ContentText({ content: content }: { content?: string | null }) {
  if (!content) {
    return (
      <Text className="text-base italic text-gray-400">No meaning yet</Text>
    );
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
          className="text-base text-gray-700 pr-8"
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
        className="absolute right-0 top-0 bottom-0 w-10"
      />
    </View>
  );
}

type DictionaryCardLayoutProps = {
  item: DictionaryBaseItem;
  headerSubTxt?: string;
  subTxtClassName?: string;
  writingClassName?: string;
  children?: React.ReactNode;
};

function DictionaryCardLayout({
  item,
  headerSubTxt,
  subTxtClassName,
  writingClassName,
  children,
}: DictionaryCardLayoutProps) {
  return (
    <Card className="mb-3">
      <View className="gap-2">
        <CardHeader
          writing={item.writing}
          subWriting={headerSubTxt}
          level={item.level}
          subwritingClassName={subTxtClassName}
          writingClassName={writingClassName}
        />
        <ContentText content={item.meaning} />

        {children}
      </View>
    </Card>
  );
}

type LanguageCardProps = {
  language?: LanguageResponse | null;
};

export function LanguageCard({ language }: LanguageCardProps) {
  if (!language) return <ErrorCard />;

  return <DictionaryCardLayout item={language} headerSubTxt={language.type} />;
}

type VocabCardProps = {
  vocab?: VocabResponse | null;
};

export function VocabCard({ vocab }: VocabCardProps) {
  if (!vocab) return <ErrorCard />;

  return (
    <DictionaryCardLayout
      item={vocab}
      headerSubTxt={vocab.reading}
      subTxtClassName="text-sm"
      writingClassName="text-sm"
    ></DictionaryCardLayout>
  );
}

type KanjiCardProps = {
  kanji?: KanjiResponse | null;
};

export function KanjiCard({ kanji }: KanjiCardProps) {
  if (!kanji) return <ErrorCard />;

  return (
    <DictionaryCardLayout
      item={kanji}
      headerSubTxt={kanji.sino}
      writingClassName="text-2xl"
    ></DictionaryCardLayout>
  );
}
