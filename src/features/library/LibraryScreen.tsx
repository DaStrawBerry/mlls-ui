import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { MemoryCellCard } from "@/features/library/components/MemoryCellCard";
import { ShelfCard } from "@/features/library/components/ShelfCard";
import { StudySetCard } from "@/features/library/components/StudySetCard";

export default function LibraryScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Library</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shelves</Text>
        <ShelfCard />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Study Sets</Text>
        <StudySetCard />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Memory Cells</Text>
        <MemoryCellCard />
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
    color: "#111827",
    fontSize: 28,
    fontWeight: "800",
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
