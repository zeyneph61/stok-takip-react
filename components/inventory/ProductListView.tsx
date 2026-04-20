import { Pressable, StyleSheet, View } from "react-native";
import { colors, spacing } from "../../theme";
import { Product } from "../../types/product";
import AppCard from "../common/AppCard";
import AppText from "../common/AppText";
import EmptyStateView from "../common/EmptyStateView";

type ProductListViewProps = {
	products: Product[];
	onSelectProduct?: (product: Product) => void;
	isLoading?: boolean;
};

export default function ProductListView({
	products,
	onSelectProduct,
	isLoading = false,
}: ProductListViewProps) {
	if (isLoading) {
		return (
			<View style={styles.emptyWrap}>
				<EmptyStateView
					title="Loading products..."
					description="Please wait while we fetch your products."
				/>
			</View>
		);
	}

	if (!products.length) {
		return (
			<View style={styles.emptyWrap}>
				<EmptyStateView
					title="No products found"
					description="Try changing the search text or category filter."
				/>
			</View>
		);
	}

	return (
		<View style={styles.content}>
			{products.map((item) => (
				<Pressable key={item.id} onPress={() => onSelectProduct?.(item)} disabled={!onSelectProduct}>
					<AppCard variant="soft" style={styles.card}>
						<View style={styles.headerRow}>
							<View style={styles.titleWrap}>
								<AppText variant="cardTitle" color={colors.textPrimary} numberOfLines={1}>
									{item.name}
								</AppText>
								<AppText variant="caption" color={colors.textMuted}>
									SKU: {item.sku || "-"}
								</AppText>
							</View>

							<View style={styles.categoryBadge}>
								<AppText variant="caption" color={colors.accentStrong} numberOfLines={1}>
									{item.category || "Unknown"}
								</AppText>
							</View>
						</View>

						<View style={styles.grid}>
							<View style={styles.cell}>
								<AppText variant="caption" color={colors.textMuted}>
									Stock
								</AppText>
								<AppText variant="body" color={colors.textPrimary}>
									{item.quantity}
								</AppText>
							</View>

							<View style={styles.cell}>
								<AppText variant="caption" color={colors.textMuted}>
									Buying
								</AppText>
								<AppText variant="body" color={colors.green}>
									{new Intl.NumberFormat("tr-TR", {
										style: "currency",
										currency: "TRY",
										maximumFractionDigits: 2,
									}).format(item.buyingPrice || 0)}
								</AppText>
							</View>

							<View style={styles.cell}>
								<AppText variant="caption" color={colors.textMuted}>
									Selling
								</AppText>
								<AppText variant="cardTitle" color={colors.accentStrong}>
									{new Intl.NumberFormat("tr-TR", {
										style: "currency",
										currency: "TRY",
										maximumFractionDigits: 2,
									}).format((item.sellPrice ?? item.price) || 0)}
								</AppText>
							</View>

							<View style={styles.cell}>
								<AppText variant="caption" color={colors.textMuted}>
									Expiry
								</AppText>
								<AppText variant="body" color={colors.red}>
									{item.expiryDate
										? new Intl.DateTimeFormat("en-GB", {
											day: "2-digit",
											month: "short",
											year: "numeric",
										}).format(new Date(item.expiryDate))
										: "-"}
								</AppText>
							</View>
						</View>
					</AppCard>
				</Pressable>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	content: {
		paddingBottom: spacing.xxl,
	},
	emptyWrap: {
		marginTop: spacing.lg,
	},
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
