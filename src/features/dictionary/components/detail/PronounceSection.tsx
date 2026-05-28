import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { DetailLinkItem } from "@/features/dictionary/components/cards/DetailLinkItem";

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
  defaultOpen?: boolean;
  defaultGroupOpen?: boolean;
};

function buildGroupKey(group: PronounceGroup, index: number) {
  return `${group.pronounce ?? "empty"}-${index}`;
}

function SectionToggleHeader({
  title,
  count,
  open,
  onPress,
}: {
  title: string;
  count: number;
  open: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between"
    >
      <View className="flex-row items-center gap-2">
        <Text className="text-lg font-bold text-gray-900">{title}</Text>
        <Text className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
          {count}
        </Text>
      </View>

      <Ionicons
        name={open ? "chevron-up" : "chevron-down"}
        size={20}
        color="#4B5563"
      />
    </Pressable>
  );
}

function PronounceGroupHeader({
  pronounce,
  exampleCount,
  open,
  onPress,
}: {
  pronounce?: string;
  exampleCount: number;
  open: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between rounded-xl bg-gray-50 px-3 py-2 active:bg-gray-100"
    >
      <View className="min-w-0 flex-1 pr-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Text
            className="text-xl font-semibold text-gray-900"
            style={{ flexShrink: 0 }}
          >
            {pronounce || "Unknown"}
          </Text>
        </ScrollView>

        <Text className="mt-1 text-xs font-medium text-gray-400">
          {exampleCount} example{exampleCount === 1 ? "" : "s"}
        </Text>
      </View>

      <Ionicons
        name={open ? "chevron-up" : "chevron-down"}
        size={18}
        color="#4B5563"
      />
    </Pressable>
  );
}

function ExampleList({ examples = [] }: { examples?: VocabExample[] }) {
  const router = useRouter();

  if (!examples.length) {
    return <Text className="px-1 py-3 text-sm italic text-gray-400">No examples yet.</Text>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="-mx-1 mt-3"
      contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
    >
      {examples.map((example) => (
        <View key={example.id} className="w-52">
          <DetailLinkItem
            compact
            scrollContent
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
        </View>
      ))}
    </ScrollView>
  );
}

export function PronounceSection({
  title,
  items = [],
  defaultOpen = true,
  defaultGroupOpen = false,
}: PronounceSectionProps) {
  const [sectionOpen, setSectionOpen] = useState(defaultOpen);
  const initialOpenGroups = useMemo(() => {
    if (!defaultGroupOpen) return {};

    return Object.fromEntries(
      items.map((group, index) => [buildGroupKey(group, index), true]),
    ) as Record<string, boolean>;
  }, [defaultGroupOpen, items]);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    initialOpenGroups,
  );

  if (!items.length) return null;

  function toggleGroup(key: string) {
    setOpenGroups((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  return (
    <View className="mt-4 rounded-2xl bg-white p-4">
      <SectionToggleHeader
        title={title}
        count={items.length}
        open={sectionOpen}
        onPress={() => setSectionOpen((current) => !current)}
      />

      {sectionOpen ? (
        <View className="mt-3 gap-3">
          {items.map((group, index) => {
            const key = buildGroupKey(group, index);
            const groupOpen = openGroups[key] ?? defaultGroupOpen;
            const examples = group.examples ?? [];

            return (
              <View key={key}>
                <PronounceGroupHeader
                  pronounce={group.pronounce}
                  exampleCount={examples.length}
                  open={groupOpen}
                  onPress={() => toggleGroup(key)}
                />

                {groupOpen ? <ExampleList examples={examples} /> : null}
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}
