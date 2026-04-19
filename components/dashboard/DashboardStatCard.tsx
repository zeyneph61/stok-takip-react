// Başlık ve sayı görüntülemek için kullanılan basit kart bileşeni
import { StyleSheet } from "react-native";
import { colors, spacing } from "../../theme";
import AppCard from "../common/AppCard";
import AppText from "../common/AppText";

type DashboardStatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "warning" | "danger" | "success";
};

export default function DashboardStatCard({
  title,
  value,
  subtitle,
  variant = "default",
}: DashboardStatCardProps) {
  const getVariantCardStyle = () => {
    switch (variant) {
      case "success":
        return styles.successCard;
      case "warning":
        return styles.warningCard;
      case "danger":
        return styles.dangerCard;
      default:
        return styles.defaultCard;
    }
  };

  const getVariantColor = () => {
    switch (variant) {
      case "danger":
        return colors.red;
      case "warning":
        return colors.orange;
      case "success":
        return colors.green;
      default:
        return colors.accentStrong;
    }
  };

  return (
    <AppCard
      variant="soft"
      style={[styles.card, getVariantCardStyle()]}
    >
      <AppText variant="caption" color={colors.textSecondary}>
        {title}
      </AppText>
      <AppText
        variant="titleLarge"
        color={getVariantColor()}
        style={styles.value}
      >
        {value}
      </AppText>
      {subtitle && (
        <AppText variant="caption" color={colors.textMuted} style={styles.subtitle}>
          {subtitle}
        </AppText>
      )}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 120,
    justifyContent: "space-between",
  },
  defaultCard: {
    backgroundColor: "#EAF4FF",
    borderColor: "#D8E9FF",
  },
  successCard: {
    backgroundColor: "#EFFFF0",
    borderColor: "#D8F4DD",
  },
  warningCard: {
    backgroundColor: "#FFF9E8",
    borderColor: "#F6E9C3",
  },
  dangerCard: {
    backgroundColor: "#FFF0F2",
    borderColor: "#F9DCE1",
  },
  value: {
    marginVertical: spacing.sm,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
});
