// Veri yoksa buraya düşer

import { StyleSheet, View } from "react-native";
import { colors, spacing } from "../../theme";
import AppText from "./AppText";

type EmptyStateViewProps = {
  title: string;
  description?: string;
};

export default function EmptyStateView({
  title,
  description,
}: EmptyStateViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <View style={styles.iconDot} />
      </View>

      <AppText variant="cardTitle" color={colors.textPrimary}>
        {title}
      </AppText>

      {description ? (
        <AppText variant="body" color={colors.textSecondary} style={styles.description}>
          {description}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xxl,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.accent,
  },
  description: {
    marginTop: spacing.sm,
    textAlign: "center",
    maxWidth: 260,
  },
});