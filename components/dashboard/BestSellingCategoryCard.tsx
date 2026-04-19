import { FlatList, StyleSheet, View } from "react-native";
import { colors, spacing } from "../../theme";
import { SalesReport } from "../../types/salesReport";
import AppCard from "../common/AppCard";
import AppText from "../common/AppText";

type BestSellingCategoryCardProps = {
  data: SalesReport[];
  isLoading?: boolean;
};

export default function BestSellingCategoryCard({
  data,
  isLoading = false,
}: BestSellingCategoryCardProps) {
  const topSellers = data?.slice(0, 5) ?? [];

  const renderItem = ({ item, index }: { item: SalesReport; index: number }) => (
    <View style={styles.listItem}>
      <View style={styles.rank}>
        <AppText variant="caption" color={colors.white}>
          #{index + 1}
        </AppText>
      </View>

      <View style={styles.productInfo}>
        <AppText variant="body" color={colors.textPrimary} numberOfLines={1}>
          {item.productName || `Product #${item.productId}`}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          {item.month && item.year
            ? `${item.month}/${item.year}`
            : item.category || "-"}
        </AppText>
      </View>

      <View style={styles.salesInfo}>
        <AppText variant="cardTitle" color={colors.accentStrong}>
          {item.quantitySold ?? item.totalQuantitySold ?? item.totalSales ?? 0}
        </AppText>
        <AppText variant="caption" color={colors.textMuted}>
          sales
        </AppText>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <AppCard style={styles.card}>
        <AppText variant="cardTitle" color={colors.textPrimary}>
          Best Sellers
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.loading}>
          Loading...
        </AppText>
      </AppCard>
    );
  }

  if (!topSellers || topSellers.length === 0) {
    return (
      <AppCard style={styles.card}>
        <AppText variant="cardTitle" color={colors.textPrimary}>
          Best Sellers
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={styles.empty}>
          No sales data yet
        </AppText>
      </AppCard>
    );
  }

  return (
    <AppCard style={styles.card}>
      <AppText
        variant="cardTitle"
        color={colors.textPrimary}
        style={styles.title}
      >
        Best Sellers
      </AppText>

      <FlatList
        data={topSellers}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          String(item.id ?? item.productId ?? `${item.productName ?? "item"}-${index}`)
        }
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.md,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  rank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accentStrong,
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  salesInfo: {
    alignItems: "flex-end",
    gap: spacing.xs,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  loading: {
    marginTop: spacing.md,
    textAlign: "center",
  },
  empty: {
    marginTop: spacing.md,
    textAlign: "center",
  },
});
