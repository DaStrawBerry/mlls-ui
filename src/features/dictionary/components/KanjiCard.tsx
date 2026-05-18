import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { Kanji } from "@/features/dictionary/types";

type KanjiCardProps = {
  kanji: Kanji;
};

export function KanjiCard({ kanji }: KanjiCardProps) {
  return (
    <Card>
      <View style={styles.row}>
        <Text style={styles.writing}>{kanji.writing}</Text>
        {kanji.level ? <Text style={styles.level}>{kanji.level}</Text> : null}
      </View>
      {kanji.meaning ? <Text style={styles.text}>{kanji.meaning}</Text> : null}
      {kanji.sino ? <Text style={styles.secondary}>{kanji.sino}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  level: {
    color: "#2563eb",
    fontWeight: "700",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  secondary: {
    color: "#6b7280",
  },
  text: {
    color: "#111827",
  },
  writing: {
    color: "#111827",
    fontSize: 32,
    fontWeight: "800",
  },
});
