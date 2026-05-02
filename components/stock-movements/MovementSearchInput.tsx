import { StyleSheet, TextInput, View } from "react-native";
import { colors, spacing } from "../../theme";
import AppText from "../common/AppText";

type MovementSearchInputProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export default function MovementSearchInput({ value, onChangeText }: MovementSearchInputProps) {
  return (
    <View style={styles.wrapper}>
      <AppText variant="caption" color={colors.textSecondary}>
        Product Search
      </AppText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search by product name..."
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#D8E2F0",
    borderRadius: 12,
    backgroundColor: "#EEF3FA",
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
  },
});
