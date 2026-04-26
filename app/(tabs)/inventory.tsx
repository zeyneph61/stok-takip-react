import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import AppButton from "../../components/common/AppButton";
import AppCard from "../../components/common/AppCard";
import AppText from "../../components/common/AppText";
import ScreenWrapper from "../../components/common/ScreenWrapper";
import SectionHeader from "../../components/common/SectionHeader";
import ProductListView from "../../components/inventory/ProductListView";
import ProductSearchInput from "../../components/inventory/ProductSearchInput";
import { inventoryService } from "../../services/inventoryService";
import { colors, spacing } from "../../theme";
import { Product } from "../../types/product";

const PAGE_SIZE = 10;

export default function InventoryScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(
        products
          .filter((item) => item.quantity > 0) // Only include active products
          .map((item) => item.category)
          .filter(Boolean)
      )
    );
    return ["All", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchText.trim().toLowerCase();

    return products
      .filter((item) => item.quantity > 0) // Hide soft-deleted products (quantity = 0)
      .filter((item) => {
        const matchesCategory =
          selectedCategory === "All" || item.category === selectedCategory;

        const matchesSearch =
          normalizedQuery.length === 0 ||
          item.name.toLowerCase().includes(normalizedQuery);

        return matchesCategory && matchesSearch;
      });
  }, [products, selectedCategory, searchText]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedCategory]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await inventoryService.getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Inventory fetch error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.pageContent}
      >
        <SectionHeader
          title="Inventory"
          subtitle="List, search and filter products"
        />

        <AppCard variant="soft" style={styles.manageCard}>
          <AppText variant="cardTitle" color={colors.textPrimary}>
            Add or Edit Products
          </AppText>
          <View style={styles.manageActions}>
            <Pressable
              onPress={() => router.push("/product-form?mode=add")}
              style={[styles.manageButton, styles.manageButtonPrimary]}
            >
              <AppText variant="body" color={colors.white}>
                Add Product
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => router.push("/product-form?mode=edit")}
              style={[styles.manageButton, styles.manageButtonSecondary]}
            >
              <AppText variant="body" color={colors.accentStrong}>
                Edit Product
              </AppText>
            </Pressable>
          </View>
        </AppCard>

        <ProductSearchInput
          value={searchText}
          onChangeText={setSearchText}
        />

        <View style={styles.filterWrap}>
          <AppText variant="caption" color={colors.textSecondary}>
            Category Filter
          </AppText>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {categories.map((category) => {
              const active = category === selectedCategory;

              return (
                <Pressable
                  key={category}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <AppText
                    variant="caption"
                    color={active ? colors.white : colors.textSecondary}
                  >
                    {category}
                  </AppText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <ProductListView
          products={paginatedProducts}
        />

        <View style={styles.paginationWrap}>
          <AppText variant="caption" color={colors.textSecondary}>
            Page {currentPage} / {totalPages}
          </AppText>
          <View style={styles.paginationActions}>
            <AppButton
              title="Prev"
              variant="secondary"
              disabled={currentPage <= 1}
              onPress={() => setCurrentPage((page) => Math.max(1, page - 1))}
              style={styles.pageButton}
            />
            <AppButton
              title="Next"
              variant="secondary"
              disabled={currentPage >= totalPages}
              onPress={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              style={styles.pageButton}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  pageContent: {
    paddingBottom: spacing.xxl,
  },
  manageCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderColor: "#D8E7FF",
    shadowColor: colors.info,
  },
  manageActions: {
    marginTop: spacing.md,
    flexDirection: "row",
    gap: spacing.sm,
  },
  manageButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  manageButtonPrimary: {
    backgroundColor: colors.accentStrong,
    borderColor: colors.accentStrong,
    shadowColor: "#0E4AB0",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  manageButtonSecondary: {
    backgroundColor: "#F8FCFA",
    borderColor: "#BFD8CD",
  },
  filterWrap: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  filterRow: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: "#D7E1F0",
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: "#F1F5FB",
  },
  filterChipActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  paginationWrap: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    alignItems: "center",
    gap: spacing.sm,
  },
  paginationActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  pageButton: {
    minWidth: 90,
  },
});