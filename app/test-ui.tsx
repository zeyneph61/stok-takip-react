import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, View } from "react-native";
import AppButton from "../components/common/AppButton";
import AppCard from "../components/common/AppCard";
import AppText from "../components/common/AppText";
import EmptyStateView from "../components/common/EmptyStateView";
import ScreenWrapper from "../components/common/ScreenWrapper";
import SectionHeader from "../components/common/SectionHeader";
import { colors, spacing } from "../theme";

const trendBars = [34, 52, 45, 58, 41, 67, 54];
const trendPoints = [22, 48, 34, 58, 44, 72, 61, 80];
const recentActions = [
  { label: "Ürün Eklendi", time: "2 dk önce", amount: "+34" },
  { label: "Sevkiyat Çıktı", time: "14 dk önce", amount: "-8" },
  { label: "Stok Güncellendi", time: "39 dk önce", amount: "+12" },
];

export default function TestUiScreen() {
  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SectionHeader
          eyebrow="Design System"
          title="Dashboard Components"
          subtitle="Temiz beyaz stil, orijinal renkler ve profesyonel dokunuşlu bileşen vitrini"
        />

        <View style={styles.quickStatsGrid}>
          <AppCard variant="soft" style={[styles.quickStatCard, styles.inventoryCard]}>
            <AppText variant="cardTitle" color={colors.accentStrong}>
              Inventory Summary
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              154 products
            </AppText>
          </AppCard>

          <AppCard variant="soft" style={[styles.quickStatCard, styles.expireCard]}>
            <AppText variant="cardTitle" color={colors.green}>
              About to Expire
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              9 items
            </AppText>
          </AppCard>

          <AppCard variant="soft" style={[styles.quickStatCard, styles.lowCard]}>
            <AppText variant="cardTitle" color={colors.red}>
              Low Stock
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              12 items
            </AppText>
          </AppCard>

          <AppCard variant="soft" style={[styles.quickStatCard, styles.orderCard]}>
            <AppText variant="cardTitle" color={colors.orange}>
              Awaiting Order
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              6 suppliers
            </AppText>
          </AppCard>
        </View>

        <AppCard style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <AppText variant="caption" color={colors.textSecondary}>
              Overall Gain
            </AppText>
            <View style={styles.badge}>
              <AppText variant="caption" color={colors.accentStrong}>
                This Week
              </AppText>
            </View>
          </View>

          <AppText variant="value" style={styles.balanceValue} color={colors.textPrimary}>
            $25,901.04
          </AppText>

          <View style={styles.chartRow}>
            <View style={styles.chartGridLine} />
            <View style={styles.chartGridLineMiddle} />
            <View style={styles.chartContent}>
              <View style={styles.chartArea}>
                {trendPoints.map((point, index) => (
                  <View
                    key={index}
                    style={[
                      styles.chartBar,
                      {
                        height: point,
                        opacity: 0.48 + index * 0.06,
                      },
                    ]}
                  />
                ))}
              </View>

              <View style={styles.sparkLine} />
              <View style={styles.sparkLineOverlay} />
              <View style={styles.sparkPoint} />
              <View style={styles.sparkTooltip}>
                <AppText variant="caption" color={colors.white}>
                  $17.2K
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <AppButton title="Add Product" style={styles.buttonFlex} />
            <AppButton
              title="Export"
              variant="secondary"
              style={styles.buttonFlex}
            />
          </View>
        </AppCard>

        <View style={styles.statsGrid}>
          <AppCard variant="soft" style={[styles.statCard, styles.lightBlueStat]}>
            <AppText variant="caption" color={colors.textSecondary}>
              Total Product
            </AppText>
            <AppText variant="titleMedium">154</AppText>
          </AppCard>

          <AppCard variant="soft" style={[styles.statCard, styles.lightYellowStat]}>
            <AppText variant="caption" color={colors.textSecondary}>
              Low Stock
            </AppText>
            <AppText variant="titleMedium" color={colors.warning}>
              12
            </AppText>
          </AppCard>
        </View>

        <AppCard style={styles.timelineCard}>
          <View style={styles.timelineHeader}>
            <AppText variant="cardTitle">Recent Activity</AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              Last 24h
            </AppText>
          </View>

          <View style={styles.timelineList}>
            {recentActions.map((item) => (
              <View key={`${item.label}-${item.time}`} style={styles.timelineRow}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineMeta}>
                  <AppText variant="body">{item.label}</AppText>
                  <AppText variant="caption" color={colors.textMuted}>
                    {item.time}
                  </AppText>
                </View>
                <AppText
                  variant="cardTitle"
                  color={item.amount.startsWith("+") ? colors.success : colors.danger}
                >
                  {item.amount}
                </AppText>
              </View>
            ))}
          </View>
        </AppCard>

        <AppCard style={styles.card}>
          <EmptyStateView
            title="Henüz hareket yok"
            description="İlk stok hareketini eklediğinde burada modern boş durum kartını göreceksin."
          />
          <View style={styles.emptyActions}>
            <AppButton title="İlk Hareketi Ekle" variant="ghost" style={styles.buttonFlex} />
            <AppButton title="Hızlı İçe Aktar" variant="secondary" style={styles.buttonFlex} />
          </View>
        </AppCard>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  quickStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  quickStatCard: {
    width: "48%",
    minHeight: 102,
    justifyContent: "space-between",
  },
  inventoryCard: {
    backgroundColor: "#EAF4FF",
    borderColor: "#D8E9FF",
  },
  expireCard: {
    backgroundColor: "#EFFFF0",
    borderColor: "#D8F4DD",
  },
  lowCard: {
    backgroundColor: "#FFF0F2",
    borderColor: "#F9DCE1",
  },
  orderCard: {
    backgroundColor: "#FFF9E8",
    borderColor: "#F6E9C3",
  },
  heroCard: {
    marginBottom: spacing.lg,
    backgroundColor: "#EDF4FF",
    borderColor: "#D6E6FF",
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D8E7FF",
  },
  balanceValue: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  chartRow: {
    height: 140,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D8E7FF",
    backgroundColor: "#F7FBFF",
    padding: spacing.sm,
    marginBottom: spacing.lg,
    overflow: "hidden",
  },
  chartBar: {
    width: 18,
    borderRadius: 8,
    backgroundColor: colors.accent,
  },
  chartGridLine: {
    position: "absolute",
    left: spacing.sm,
    right: spacing.sm,
    top: "33%",
    height: 1,
    backgroundColor: "rgba(21, 115, 254, 0.08)",
  },
  chartGridLineMiddle: {
    position: "absolute",
    left: spacing.sm,
    right: spacing.sm,
    top: "66%",
    height: 1,
    backgroundColor: "rgba(21, 115, 254, 0.06)",
  },
  chartContent: {
    flex: 1,
    justifyContent: "flex-end",
  },
  chartArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 88,
  },
  sparkLine: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 28,
    height: 2,
    borderRadius: 999,
    backgroundColor: "rgba(21, 115, 254, 0.18)",
    transform: [{ rotate: "-6deg" }],
  },
  sparkLineOverlay: {
    position: "absolute",
    left: 16,
    right: 18,
    bottom: 26,
    height: 3,
    borderRadius: 999,
    backgroundColor: "rgba(21, 115, 254, 0.34)",
    transform: [{ rotate: "-6deg" }],
  },
  sparkPoint: {
    position: "absolute",
    right: 34,
    bottom: 40,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.accentStrong,
    shadowColor: colors.accentStrong,
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  sparkTooltip: {
    position: "absolute",
    right: 12,
    bottom: 58,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: colors.accentStrong,
    shadowColor: colors.accentStrong,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  buttonFlex: {
    flex: 1,
    alignSelf: "stretch",
    width: "100%",
  },
  statsGrid: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    gap: spacing.xs,
  },
  lightBlueStat: {
    backgroundColor: "#EAF3FF",
    borderColor: "#D8E7FF",
  },
  lightYellowStat: {
    backgroundColor: "#FFF8E5",
    borderColor: "#F4E5B8",
  },
  timelineCard: {
    marginBottom: spacing.lg,
  },
  timelineHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  timelineList: {
    gap: spacing.sm,
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E7EDF8",
    backgroundColor: "#FBFDFF",
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.info,
  },
  timelineMeta: {
    flex: 1,
  },
  card: {
    marginBottom: spacing.lg,
  },
  emptyActions: {
    flexDirection: "column",
    gap: spacing.sm,
    width: "100%",
    marginTop: spacing.lg,
  },
});