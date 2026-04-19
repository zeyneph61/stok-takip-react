import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import SectionHeader from "../../components/common/SectionHeader";
import BestSellingCategoryCard from "../../components/dashboard/BestSellingCategoryCard";
import DashboardStatCard from "../../components/dashboard/DashboardStatCard";
import InventorySummaryCard from "../../components/dashboard/InventorySummaryCard";
import { dashboardService } from "../../services/dashboardService";
import { spacing } from "../../theme";
import { ExpiryAlert } from "../../types/expiryAlert";
import { LowStockAlert } from "../../types/lowStockAlert";
import { Product } from "../../types/product";
import { SalesReport } from "../../types/salesReport";

export default function DashboardScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);
  const [expiryAlerts, setExpiryAlerts] = useState<ExpiryAlert[]>([]);
  const [salesReports, setSalesReports] = useState<SalesReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const lowStockCount = lowStockAlerts.length;
  const expiringCount = expiryAlerts.length;
  const totalStockQuantity = products.reduce(
    (sum, product) => sum + (product.quantity ?? 0),
    0
  );
  const outOfStockCount = products.filter((item) => (item.quantity ?? 0) <= 0).length;

  const productMap = products.reduce<Record<number, Product>>((acc, product) => {
    acc[product.id] = product;
    return acc;
  }, {});

  const enrichedSalesReports = salesReports.map((item) => ({
    ...item,
    productName: item.productName || productMap[item.productId]?.name,
    category: item.category || productMap[item.productId]?.category || "Uncategorized",
  }));

  const categorySummary = enrichedSalesReports.reduce<
    Record<string, { name: string; totalSold: number; totalRevenue: number }>
  >((acc, item) => {
    const categoryName = item.category || "Uncategorized";
    const sold = item.quantitySold ?? item.totalQuantitySold ?? item.totalSales ?? 0;

    if (!acc[categoryName]) {
      acc[categoryName] = { name: categoryName, totalSold: 0, totalRevenue: 0 };
    }

    acc[categoryName].totalSold += sold;
    acc[categoryName].totalRevenue += item.totalRevenue ?? 0;
    return acc;
  }, {});

  const topSalesCategories = Object.values(categorySummary)
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 4);

  const inventoryCategorySummary = products.reduce<
    Record<string, { name: string; totalSold: number; totalRevenue: number }>
  >((acc, item) => {
    const categoryName = item.category || "Uncategorized";
    if (!acc[categoryName]) {
      acc[categoryName] = { name: categoryName, totalSold: 0, totalRevenue: 0 };
    }
    acc[categoryName].totalSold += item.quantity ?? 0;
    return acc;
  }, {});

  const topInventoryCategories = Object.values(inventoryCategorySummary).sort(
    (a, b) => b.totalSold - a.totalSold
  );

  const topCategories = [...topSalesCategories];
  for (const category of topInventoryCategories) {
    if (topCategories.length >= 4) {
      break;
    }

    if (!topCategories.some((existing) => existing.name === category.name)) {
      topCategories.push(category);
    }
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        const [productsData, lowStockData, expiredData, salesData] =
          await Promise.all([
            dashboardService.getProducts(),
            dashboardService.getLowStockAlerts(),
            dashboardService.getExpiryAlerts(),
            dashboardService.getTopSelling(10),
          ]);

        setProducts(Array.isArray(productsData) ? productsData : []);
        setLowStockAlerts(Array.isArray(lowStockData) ? lowStockData : []);
        setExpiryAlerts(Array.isArray(expiredData) ? expiredData : []);
        setSalesReports(Array.isArray(salesData) ? salesData : []);
      } catch (err) {
        console.error("Dashboard fetch hatası:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SectionHeader
          title="Dashboard"
          subtitle="Stock management overview"
        />

        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <DashboardStatCard
              title="Inventory Summary"
              value={totalStockQuantity}
              subtitle="Quantity in hand"
            />
            <DashboardStatCard
              title="About to Expire"
              value={expiringCount}
              variant="success"
              subtitle="Products expiring soon"
            />
          </View>

          <View style={styles.statsRow}>
            <DashboardStatCard
              title="Low Stock"
              value={lowStockCount}
              variant="warning"
              subtitle="Items below threshold"
            />
            <DashboardStatCard
              title="Out of Stock"
              value={outOfStockCount}
              variant="danger"
              subtitle="0 remaining items"
            />
          </View>
        </View>

        <InventorySummaryCard categories={topCategories} />

        <BestSellingCategoryCard data={enrichedSalesReports} isLoading={isLoading} />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  statsGrid: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
});
