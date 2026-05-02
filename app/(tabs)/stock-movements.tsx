import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import AppCard from "../../components/common/AppCard";
import AppText from "../../components/common/AppText";
import EmptyStateView from "../../components/common/EmptyStateView";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import SectionHeader from "../../components/common/SectionHeader";
import MovementDateFilter, { DateRangeOption } from "../../components/stock-movements/MovementDateFilter";
import MovementSearchInput from "../../components/stock-movements/MovementSearchInput";
import MovementTypeFilter, { MovementTypeOption } from "../../components/stock-movements/MovementTypeFilter";
import StockMovementCard from "../../components/stock-movements/StockMovementCard";
import { stockMovementsService } from "../../services/stockMovementsService";
import { colors, spacing } from "../../theme";
import { StockMovement } from "../../types/stockMovement";

function getDateRangeStart(range: DateRangeOption): Date | null {
  const now = new Date();
  if (range === "today") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (range === "week") {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(now.getFullYear(), now.getMonth(), diff);
  }
  if (range === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  return null;
}

export default function StockMovementsScreen() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedType, setSelectedType] = useState<MovementTypeOption>("all");
  const [selectedDate, setSelectedDate] = useState<DateRangeOption>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await stockMovementsService.getAll();
        setMovements(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Stock movements fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    const dateStart = getDateRangeStart(selectedDate);

    return movements.filter((m) => {
      if (selectedType !== "all" && m.movementType !== selectedType) return false;

      if (dateStart) {
        const created = new Date(m.date);
        if (created < dateStart) return false;
      }

      if (query && !m.product?.name?.toLowerCase().includes(query)) return false;

      return true;
    });
  }, [movements, selectedType, selectedDate, searchText]);

  const totalIn = useMemo(
    () => movements.filter((m) => m.movementType === "In").reduce((s, m) => s + m.quantity, 0),
    [movements]
  );
  const totalOut = useMemo(
    () => movements.filter((m) => m.movementType === "Out").reduce((s, m) => s + m.quantity, 0),
    [movements]
  );

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.pageContent}
      >
        <SectionHeader
          title="Stock Movements"
          subtitle="Track all incoming and outgoing stock"
        />

        <View style={styles.statsRow}>
          <AppCard variant="soft" style={[styles.statCard, styles.statIn]}>
            <AppText variant="caption" color={colors.green}>
              Total In
            </AppText>
            <AppText variant="cardTitle" color={colors.green}>
              +{totalIn}
            </AppText>
          </AppCard>

          <AppCard variant="soft" style={[styles.statCard, styles.statOut]}>
            <AppText variant="caption" color={colors.red}>
              Total Out
            </AppText>
            <AppText variant="cardTitle" color={colors.red}>
              -{totalOut}
            </AppText>
          </AppCard>

          <AppCard variant="soft" style={[styles.statCard, styles.statTotal]}>
            <AppText variant="caption" color={colors.textSecondary}>
              Records
            </AppText>
            <AppText variant="cardTitle" color={colors.textPrimary}>
              {movements.length}
            </AppText>
          </AppCard>
        </View>

        <MovementSearchInput value={searchText} onChangeText={setSearchText} />

        <MovementTypeFilter selected={selectedType} onSelect={setSelectedType} />

        <MovementDateFilter selected={selectedDate} onSelect={setSelectedDate} />

        {loading ? (
          <AppText variant="body" color={colors.textMuted} style={styles.loadingText}>
            Loading...
          </AppText>
        ) : filtered.length === 0 ? (
          <EmptyStateView
            title="No movements found"
            description="Try adjusting your filters or search query."
          />
        ) : (
          <View>
            <AppText variant="caption" color={colors.textMuted} style={styles.resultCount}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </AppText>
            {filtered.map((movement) => (
              <StockMovementCard key={movement.id} movement={movement} />
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  pageContent: {
    paddingBottom: spacing.xxl,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    alignItems: "center",
    gap: 4,
  },
  statIn: {
    backgroundColor: colors.lightgreen,
    borderColor: "#A8E6CF",
  },
  statOut: {
    backgroundColor: colors.lightred,
    borderColor: "#F5B8BF",
  },
  statTotal: {
    backgroundColor: colors.surfaceSoft,
    borderColor: colors.border,
  },
  loadingText: {
    textAlign: "center",
    marginTop: spacing.xxl,
  },
  resultCount: {
    marginBottom: spacing.sm,
  },
});
