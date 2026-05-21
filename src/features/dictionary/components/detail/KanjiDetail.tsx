import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";

import { useKanjiDetail } from "@/features/dictionary/hooks/useKanji";

import { CenteredMessage } from "@/components/ui/CenteredMessage";
import { Pill } from "@/components/ui/Pill";
import { DetailLinkItem } from "@/features/dictionary/components/cards/DetailLinkItem";
import { EditBtn } from "@/features/dictionary/components/edit/EditBtn";
import { LanguageSection } from "./LanguageSection";
import { LinkSection } from "./LinkSection";
import { PronounceSection } from "./PronounceSection";
import { TagList } from "./TagList";

type KanjiDetailProps = {
  id: string;
};

export function KanjiDetail({ id }: KanjiDetailProps) {
  const query = useKanjiDetail(id);
  const router = useRouter();

  if (query.isLoading) return <CenteredMessage text="Loading kanji..." />;
  if (query.isError) return <CenteredMessage text="Failed to load kanji." />;
  if (!query.data) return <CenteredMessage text="Kanji not found." />;

  const kanji = query.data;

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4">
      <View className="py-4">
        <View className="rounded-2xl bg-white p-6">
          <View>
            <EditBtn id={id} router={router} type="KANJI" />
          </View>
          <Text className="text-center text-7xl font-bold text-gray-900">
            {kanji.writing}
          </Text>

          <View className="mt-4 flex-row flex-wrap justify-center gap-2">
            {kanji.level ? <Pill text={kanji.level} /> : null}
            {kanji.stroke ? <Pill text={`${kanji.stroke} strokes`} /> : null}
          </View>

          {kanji.sino ? (
            <Text className="mt-4 text-center text-base text-gray-600">
              {kanji.sino}
            </Text>
          ) : null}
        </View>

        {kanji.meaning ? (
          <LanguageSection title="Meaning">
            <Text className="text-base text-gray-800">{kanji.meaning}</Text>
          </LanguageSection>
        ) : null}

        {kanji.note ? (
          <LanguageSection title="Note">
            <Text className="text-base text-gray-700">{kanji.note}</Text>
          </LanguageSection>
        ) : null}

        <LinkSection
          title="Components"
          items={kanji.components}
          renderItem={(component) => (
            <DetailLinkItem
              key={component.id}
              primary={component.writing}
              secondary={component.sino}
              onPress={() =>
                router.push({
                  pathname: "/language/[type]/[id]",
                  params: {
                    type: "KANJI",
                    id: component.id,
                  },
                })
              }
            />
          )}
        />

        <PronounceSection title="Kunyomi" items={kanji.kunyomi} />
        <PronounceSection title="Onyomi" items={kanji.onyomi} />

        {kanji.tags?.length ? (
          <LanguageSection title="Tags">
            <TagList tags={kanji.tags} />
          </LanguageSection>
        ) : null}
      </View>
    </ScrollView>
  );
}
