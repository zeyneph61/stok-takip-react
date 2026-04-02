// Uygulama içindeki kart bileşeni. İçerik için bir konteyner sağlar ve ortak stilleri uygular.

import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { colors, spacing } from "../../theme";

type AppCardProps = {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  variant?: "default" | "soft";
};

export default function AppCard({
  children,
  style,
  variant = "default",
}: AppCardProps) {
  return (
    <View style={[styles.card, variant === "soft" && styles.softCard, style]}>
      <View pointerEvents="none" style={styles.topHighlight} />
      <View pointerEvents="none" style={styles.cornerGlow} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    shadowColor: "#104CB4",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  softCard: {
    backgroundColor: colors.surfaceSoft,
    shadowOpacity: 0.04,
    elevation: 2,
  },
  content: {
    zIndex: 3,
  },
  topHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(21, 115, 254, 0.12)",
    zIndex: 2,
  },
  cornerGlow: {
    position: "absolute",
    top: -78,
    right: -42,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(47, 140, 255, 0.08)",
    zIndex: 1,
  },
});