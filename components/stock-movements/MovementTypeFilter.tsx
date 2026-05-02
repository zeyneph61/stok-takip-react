import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { colors, spacing } from "../../theme";
import { StockMovement } from "../../types/stockMovement";
import AppText from "../common/AppText";

export type MovementTypeOption = StockMovement["movementType"] | "all";

const OPTIONS: { value: MovementTypeOption; label: string }[] = [
  { value: "all", label: "All" },
  { value: "In", label: "In" },
  { value: "Out", label: "Out" },
];

type MovementTypeFilterProps = {
  selected: MovementTypeOption;
  onSelect: (value: MovementTypeOption) => void;
};

export default function MovementTypeFilter({ selected, onSelect }: MovementTypeFilterProps) {
  return (
    <View style={styles.wrapper}>
      <AppText variant="caption" color={colors.textSecondary}>
        Movement Type
      </AppText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {OPTIONS.map((opt) => {
          const active = opt.value === selected;
          return (
            <Pressable
              key={opt.value}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onSelect(opt.value)}
            >
              <AppText
                variant="caption"
                color={active ? colors.white : colors.textSecondary}
              >
                {opt.label}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  row: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#D7E1F0",
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: "#F1F5FB",
  },
  chipActive: {
    backgroundColor: colors.accentStrong,
    borderColor: colors.accentStrong,
  },
});
