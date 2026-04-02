// Tüm ekranlarda ortak olarak kullanılan bir wrapper. SafeAreaView kullanarak ekranın güvenli alanını korur ve ortak stilleri uygular.

import { ReactNode } from "react";
import { SafeAreaView, StyleSheet, View, ViewStyle } from "react-native";
import { colors, spacing } from "../../theme";

type ScreenWrapperProps = {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export default function ScreenWrapper({
  children,
  style,
}: ScreenWrapperProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View pointerEvents="none" style={styles.glowTop} />
      <View pointerEvents="none" style={styles.glowBottom} />
      <View style={[styles.content, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  glowTop: {
    position: "absolute",
    top: -120,
    right: -90,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(21, 115, 254, 0.13)",
  },
  glowBottom: {
    position: "absolute",
    bottom: -140,
    left: -90,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(4, 156, 107, 0.08)",
  },
});