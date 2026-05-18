import React, { ReactNode } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

type CardProps = {
  children?: ReactNode;
  subtitle?: string;
  title?: string;
  style?: ViewStyle;
};

export function Card({ children, subtitle, title, style }: CardProps) {
  return (
    <View style={[styles.card, style]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  subtitle: {
    color: "#4b5563",
    lineHeight: 20,
  },
  title: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "700",
  },
});
