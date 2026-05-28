import { useRouter } from "expo-router";
import { Alert, ScrollView, Text, View } from "react-native";

import { CenteredMessage } from "@/components/ui/CenteredMessage";
import { Pill } from "@/components/ui/Pill";
import { DetailLinkItem } from "@/features/dictionary/components/cards/DetailLinkItem";
import { useSyncDictionaryCells } from "@/features/dictionary/hooks/useSync";
import { useVocabDetail } from "@/features/dictionary/hooks/useVocab";
import { DictionaryDetailActions } from "./DictionaryDetailActions";
import { LanguageSection } from "./LanguageSection";
import { LinkSection } from "./LinkSection";
import { TagList } from "./TagList";

type VocabularyDetailProps = {
  id: string;
};

export function VocabularyDetail({ id }: VocabularyDetailProps) {
  const query = useVocabDetail(id);
  const router = useRouter();
  const syncMutation = useSyncDictionaryCells();

  if (query.isLoading) return <CenteredMessage text="Loading vocabulary..." />;
  if (query.isError) {
    return <CenteredMessage text="Failed to load vocabulary." />;
  }
  if (!query.data) return <CenteredMessage text="Vocabulary not found." />;

  const vocab = query.data;

  function handleSync() {
    syncMutation.mutate(
      {
        vocabIds: [id],
      },
      {
        onSuccess: (syncedCells) => {
          Alert.alert("Sync completed", `${syncedCells.length} cell synced.`);
        },
        onError: (error) => {
          Alert.alert("Sync failed", error.message);
        },
      },
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4">
      <View className="py-4">
        <View className="rounded-2xl bg-white p-6">
          <DictionaryDetailActions
            id={id}
            type="VOCABULARY"
            router={router}
            syncing={syncMutation.isPending}
            onSync={handleSync}
          />
          <Text className="text-center text-5xl font-bold text-gray-900">
            {vocab.writing}
          </Text>

          {vocab.reading ? (
            <Text className="mt-2 text-center text-xl text-gray-600">
              {vocab.reading}
            </Text>
          ) : null}

          {vocab.meaning ? (
            <Text className="mt-4 text-center text-base text-gray-800">
              {vocab.meaning}
            </Text>
          ) : null}

          {vocab.level ? (
            <View className="mt-4 items-center">
              <Pill text={vocab.level} />
            </View>
          ) : null}
        </View>

        {vocab.note ? (
          <LanguageSection title="Note">
            <Text className="text-base text-gray-700">{vocab.note}</Text>
          </LanguageSection>
        ) : null}

        <LinkSection
          title="Kanji components"
          items={vocab.kanjiComponents}
          keyExtractor={(component) => component.id}
          renderItem={(component) => (
            <DetailLinkItem
              compact
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

        <LinkSection
          title="Vocab components"
          items={vocab.vocabComponents}
          keyExtractor={(component) => component.id}
          renderItem={(component) => (
            <DetailLinkItem
              compact
              primary={component.writing}
              secondary={component.reading}
              onPress={() =>
                router.push({
                  pathname: "/language/[type]/[id]",
                  params: {
                    type: "VOCABULARY",
                    id: component.id,
                  },
                })
              }
            />
          )}
        />

        <LinkSection
          title="Collocations"
          items={vocab.collocations}
          keyExtractor={(collocation) => collocation.id}
          renderItem={(collocation) => (
            <DetailLinkItem
              compact
              primary={collocation.writing}
              secondary={collocation.reading}
              onPress={() =>
                router.push({
                  pathname: "/language/[type]/[id]",
                  params: {
                    type: "VOCABULARY",
                    id: collocation.id,
                  },
                })
              }
            />
          )}
        />

        {vocab.tags?.length ? (
          <LanguageSection title="Tags">
            <TagList tags={vocab.tags} />
          </LanguageSection>
        ) : null}
      </View>
    </ScrollView>
  );
}
