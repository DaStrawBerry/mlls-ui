import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { DetailLinkItem } from "@/features/dictionary/components/cards/DetailLinkItem";
import { LanguageSection } from "@/features/dictionary/components/detail/LanguageSection";

type VocabExample = {
  id: string;
  writing?: string;
  reading?: string;
  meaning?: string;
};

type PronounceGroup = {
  pronounce?: string;
  examples?: VocabExample[];
};

type PronounceSectionProps = {
  title: string;
  items?: PronounceGroup[];
};

export function PronounceSection({ title, items = [] }: PronounceSectionProps) {
  const router = useRouter();

  if (!items.length) return null;

  return (
    <LanguageSection title={title}>
      {items.map((group, index) => (
        <View key={`${group.pronounce}-${index}`} className="mb-4 last:mb-0">
          {group.pronounce ? (
            <Text className="mb-2 text-xl font-semibold text-gray-900">
              {group.pronounce}
            </Text>
          ) : null}

          {group.examples?.map((example) => (
            <DetailLinkItem
              key={example.id}
              primary={example.writing}
              secondary={example.reading}
              tertiary={example.meaning}
              onPress={() =>
                router.push({
                  pathname: "/language/[type]/[id]",
                  params: {
                    type: "VOCABULARY",
                    id: example.id,
                  },
                })
              }
            />
          ))}
        </View>
      ))}
    </LanguageSection>
  );
}
