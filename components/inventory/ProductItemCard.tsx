import { Pressable, StyleSheet, View } from "react-native";
import { colors, spacing } from "../../theme";
import { Product } from "../../types/product";
import AppCard from "../common/AppCard";
import AppText from "../common/AppText";

type ProductItemCardProps = {
  product: Product;
  onPress?: (product: Product) => void;
};

function formatPrice(value?: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function ProductItemCard({ product, onPress }: ProductItemCardProps) {
  const sellingPrice = product.sellPrice ?? product.price ?? 0;
  const buyingPrice = product.buyingPrice ?? 0;

  return (
    <Pressable onPress={() => onPress?.(product)} disabled={!onPress}>
      <AppCard variant="soft" style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.titleWrap}>
            <AppText variant="cardTitle" color={colors.textPrimary} numberOfLines={1}>
              {product.name}
            </AppText>
            <AppText variant="caption" color={colors.textMuted}>
              SKU: {product.sku || "-"}
            </AppText>
          </View>

          <View style={styles.categoryBadge}>
            <AppText variant="caption" color={colors.accentStrong} numberOfLines={1}>
              {product.category || "Unknown"}
            </AppText>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.cell}>
            <AppText variant="caption" color={colors.textMuted}>
              Stock
            </AppText>
            <AppText variant="body" color={colors.textPrimary}>
              {product.quantity}
            </AppText>
          </View>

          <View style={styles.cell}>
            <AppText variant="caption" color={colors.textMuted}>
              Buying
            </AppText>
            <AppText variant="body" color={colors.green}>
              {formatPrice(buyingPrice)}
            </AppText>
          </View>

          <View style={styles.cell}>
            <AppText variant="caption" color={colors.textMuted}>
              Selling
            </AppText>
            <AppText variant="cardTitle" color={colors.accentStrong}>
              {formatPrice(sellingPrice)}
            </AppText>
          </View>

          <View style={styles.cell}>
            <AppText variant="caption" color={colors.textMuted}>
              Expiry
            </AppText>
            <AppText variant="body" color={colors.red}>
              {formatDate(product.expiryDate)}
            </AppText>
          </View>
        </View>
      </AppCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
    padding: spacing.md,
    backgroundColor: "#EDF4FF",
    borderColor: "#D8E7FF",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  titleWrap: {
    flex: 1,
    gap: 2,
  },
  categoryBadge: {
    borderWidth: 1,
    borderColor: "#C8DBFB",
    backgroundColor: "#F3F8FF",
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    maxWidth: 120,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  cell: {
    width: "48%",
    minHeight: 42,
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#F7FAFF",
    borderWidth: 1,
    borderColor: "#E1EAF7",
  },
});
