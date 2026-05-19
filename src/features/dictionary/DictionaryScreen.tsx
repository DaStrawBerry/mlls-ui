import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import { KanjiCard } from "@/features/dictionary/components/KanjiCard";
import { VocabularyCard } from "@/features/dictionary/components/VocabularyCard";
import { useKanji } from "@/features/dictionary/hooks/useKanji";

export default function DictionaryScreen() {
  const { data: kanji, error, loading } = useKanji();

  if (loading) {
    return <Loading label="Loading dictionary..." />;
  }

  if (error) {
    return (
      <View style={styles.screen}>
        <Card title="Dictionary" subtitle="Kanji could not be loaded yet." />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text className="text-amber-500" style={styles.heading}>
        Dictionary
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kanji</Text>
        {kanji.length > 0 ? (
          kanji.map((item) => <KanjiCard key={item.id} kanji={item} />)
        ) : (
          <Card subtitle="No kanji found." />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vocabulary</Text>
        <VocabularyCard />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
    padding: 24,
  },
  heading: {
    // color: "#111827",
    fontSize: 28,
    fontWeight: "800",
  },
  screen: {
    flex: 1,
    padding: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "700",
  },
});
