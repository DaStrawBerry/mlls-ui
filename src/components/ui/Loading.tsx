import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type LoadingProps = {
  label?: string;
};

export function Loading({ label = "Loading..." }: LoadingProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    gap: 12,
    justifyContent: "center",
    padding: 24,
  },
  label: {
    color: "#4b5563",
  },
});
