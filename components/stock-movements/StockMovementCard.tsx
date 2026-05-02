import { StyleSheet, View } from "react-native";
import { colors, spacing } from "../../theme";
import { StockMovement } from "../../types/stockMovement";
import AppCard from "../common/AppCard";
import AppText from "../common/AppText";

type StockMovementCardProps = {
  movement: StockMovement;
};

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

const TYPE_CONFIG = {
  In: {
    label: "IN",
    bg: colors.lightgreen,
    border: "#A8E6CF",
    color: colors.green,
    cardBg: "#F2FFF6",
    cardBorder: "#C8EDD8",
    quantityColor: colors.green,
    prefix: "+",
  },
  Out: {
    label: "OUT",
    bg: colors.lightred,
    border: "#F5B8BF",
    color: colors.red,
    cardBg: "#FFF5F6",
    cardBorder: "#F5D0D4",
    quantityColor: colors.red,
    prefix: "-",
  },
} as const;

const FALLBACK_CONFIG = {
  label: "---",
  bg: "#F1F5FB",
  border: "#D7E1F0",
  color: colors.textMuted,
  cardBg: colors.surfaceSoft,
  cardBorder: colors.border,
  quantityColor: colors.textSecondary,
  prefix: "±",
};

export default function StockMovementCard({ movement }: StockMovementCardProps) {
  const cfg = TYPE_CONFIG[movement.movementType] ?? FALLBACK_CONFIG;
  const productName = movement.product?.name ?? "-";
  const category = movement.product?.category;

  return (
    <AppCard
      variant="soft"
      style={[styles.card, { backgroundColor: cfg.cardBg, borderColor: cfg.cardBorder }]}
    >
      <View style={styles.row}>
        <View style={styles.info}>
          <AppText variant="cardTitle" color={colors.textPrimary} numberOfLines={1}>
            {productName}
          </AppText>
          {category ? (
            <AppText variant="caption" color={colors.textMuted} numberOfLines={1}>
              {category}
            </AppText>
          ) : null}
          <AppText variant="caption" color={colors.textMuted}>
            {formatDate(movement.date)}
          </AppText>
        </View>

        <View style={styles.right}>
          <View style={[styles.typeBadge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
            <AppText variant="caption" color={cfg.color}>
              {cfg.label}
            </AppText>
          </View>
          <AppText variant="cardTitle" color={cfg.quantityColor} style={styles.quantity}>
            {cfg.prefix}{movement.quantity}
          </AppText>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  right: {
    alignItems: "flex-end",
    gap: spacing.xs,
  },
  typeBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  quantity: {
    fontSize: 18,
  },
});
