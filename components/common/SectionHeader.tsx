
// Ekran başlıkları için kullanılan bir bileşen. Başlık ve isteğe bağlı olarak alt başlık içerebilir.

import { StyleSheet, View } from "react-native";
import { colors, spacing } from "../../theme";
import AppText from "./AppText";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
};

export default function SectionHeader({
  title,
  subtitle,
  eyebrow,
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      {eyebrow ? (
        <AppText variant="caption" color={colors.textMuted} style={styles.eyebrow}>
          {eyebrow.toUpperCase()}
        </AppText>
      ) : null}

      <AppText variant="titleLarge" color={colors.textPrimary}>
        {title}
      </AppText>

      {subtitle ? (
        <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  eyebrow: {
    marginBottom: spacing.xs,
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: spacing.xs,
    maxWidth: 310,
  },
});