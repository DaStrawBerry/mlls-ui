import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function DictionaryScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Empty Dash Board</Text>
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
