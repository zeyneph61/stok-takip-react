import { Pressable, StyleSheet } from "react-native";
import { colors, spacing } from "../../theme";
import AppText from "../common/AppText";

type EditProductButtonProps = {
	onPress?: () => void;
};

export default function EditProductButton({ onPress }: EditProductButtonProps) {
	return (
		<Pressable onPress={onPress} style={styles.button}>
			<AppText variant="caption" color={colors.accentStrong}>
				Edit
			</AppText>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	button: {
		alignSelf: "flex-end",
		borderWidth: 1,
		borderColor: "#BCD5FF",
		backgroundColor: "#F4F8FF",
		borderRadius: 14,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.lg,
	},
});
