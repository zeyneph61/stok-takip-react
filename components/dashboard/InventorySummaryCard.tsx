import { StyleSheet, View } from "react-native";
import { colors, spacing } from "../../theme";
import AppCard from "../common/AppCard";
import AppText from "../common/AppText";

type TopCategory = {
  name: string;
  totalSold: number;
  totalRevenue: number;
};

type InventorySummaryCardProps = {
  categories: TopCategory[];
};

export default function InventorySummaryCard({
  categories,
}: InventorySummaryCardProps) {
  const topCategory = categories[0];

  return (
    <AppCard style={styles.card}>
      <AppText variant="cardTitle" color={colors.textPrimary} style={styles.title}>
        Top Category
      </AppText>

      <View style={styles.grid}>
        {topCategory ? (
          <View style={styles.item}>
            <View style={styles.rankBadge}>
              <AppText variant="caption" color={colors.white}>
                #1
              </AppText>
            </View>

            <View style={styles.content}>
              <AppText variant="body" color={colors.textPrimary} numberOfLines={1}>
                {topCategory.name}
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                {topCategory.totalSold} sold
              </AppText>
            </View>

            <AppText variant="cardTitle" color={colors.accentStrong}>
              ${topCategory.totalRevenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            </AppText>
          </View>
        ) : (
          <AppText variant="body" color={colors.textSecondary}>
            No category sales data available.
          </AppText>
        )}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
    backgroundColor: "#F3FBF6",
    borderColor: "#D9EEDD",
  },
  title: {
    marginBottom: spacing.md,
  },
  grid: {
    gap: spacing.md,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2EFE6",
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0E9F6E",
  },
  content: {
    flex: 1,
  },
});
