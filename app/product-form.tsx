import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import AppButton from "../components/common/AppButton";
import AppCard from "../components/common/AppCard";
import AppText from "../components/common/AppText";
import ScreenWrapper from "../components/common/ScreenWrapper";
import ProductListView from "../components/inventory/ProductListView";
import ProductSearchInput from "../components/inventory/ProductSearchInput";
import { inventoryService } from "../services/inventoryService";
import { colors, spacing } from "../theme";
import { Product } from "../types/product";

type Mode = "add" | "edit";

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function ProductFormScreen() {
  const params = useLocalSearchParams<{ mode?: string; productId?: string }>();
  const mode: Mode = params.mode === "edit" ? "edit" : "add";
  const productId = params.productId ? Number(params.productId) : undefined;

  const [products, setProducts] = useState<Product[]>([]);
  const [pickerSearch, setPickerSearch] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [thresholdValue, setThresholdValue] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [noExpiryDate, setNoExpiryDate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const isEditMode = useMemo(() => mode === "edit", [mode]);
  const showPicker = isEditMode && !productId;

  const availability = useMemo(() => {
    const stock = toNumber(quantity);
    const threshold = toNumber(thresholdValue);

    if (stock <= 0) return "Out of Stock";
    if (stock <= threshold) return "Low Stock";
    return "In Stock";
  }, [quantity, thresholdValue]);

  const filteredProducts = useMemo(() => {
    const query = pickerSearch.trim().toLowerCase();
    if (!query) return products;
    return products.filter((item) => item.name.toLowerCase().includes(query));
  }, [pickerSearch, products]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const data = await inventoryService.getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Product picker fetch error:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!productId) {
      return;
    }

    const fetchProduct = async () => {
      try {
        const product = await inventoryService.getProductById(productId);
        setName(product.name ?? "");
        setCategory(product.category ?? "");
        setBuyingPrice(String(product.buyingPrice ?? ""));
        setSellPrice(String(product.sellPrice ?? product.price ?? ""));
        setQuantity(String(product.quantity ?? ""));
        setThresholdValue(String(product.thresholdValue ?? ""));
        const nextExpiryDate = product.expiryDate ? String(product.expiryDate).slice(0, 10) : "";
        setExpiryDate(nextExpiryDate);
        setNoExpiryDate(!nextExpiryDate);
      } catch (error) {
        console.error("Product detail fetch error:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  const onSave = async () => {
    if (!name.trim() || !category.trim()) {
      return;
    }

    setIsSaving(true);
    try {
      const basePayload: any = {
        name: name.trim(),
        category: category.trim(),
        sku: "-",
        buyingPrice: toNumber(buyingPrice),
        sellPrice: toNumber(sellPrice),
        price: toNumber(sellPrice),
        quantity: toNumber(quantity),
        thresholdValue: toNumber(thresholdValue),
      };

      if (!isEditMode) {
        basePayload.availability = availability;
      }

      if (!noExpiryDate && expiryDate) {
        basePayload.expiryDate = new Date(expiryDate).toISOString();
      }

      if (isEditMode && productId) {
        await inventoryService.updateProduct(productId, basePayload);
      } else {
        await inventoryService.createProduct(basePayload);
      }

      setSuccessMessage(isEditMode ? "Product updated successfully!" : "Product created successfully!");
      setTimeout(() => {
        router.back();
      }, 1200);
    } catch (error) {
      console.error("Product save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {successMessage ? (
          <View style={styles.successBanner}>
            <AppText variant="cardTitle" color={colors.white} style={styles.successText}>
              ✓ {successMessage}
            </AppText>
          </View>
        ) : null}

        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <AppText variant="cardTitle" color={colors.textPrimary}>
              ←
            </AppText>
          </Pressable>

          <View style={styles.segmentWrap}>
            <Pressable
              onPress={() => router.replace("/product-form?mode=add")}
              style={[styles.segment, !isEditMode && styles.segmentActive]}
            >
              <AppText variant="caption" color={!isEditMode ? colors.white : colors.textSecondary}>
                Add Product
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => router.replace("/product-form?mode=edit")}
              style={[styles.segment, isEditMode && styles.segmentActive]}
            >
              <AppText variant="caption" color={isEditMode ? colors.white : colors.textSecondary}>
                Edit Product
              </AppText>
            </Pressable>
          </View>
        </View>

        <View style={styles.heroCard}>
          <AppText variant="titleLarge" color={colors.textPrimary}>
            {showPicker ? "Select Product to Edit" : isEditMode ? "Edit Product" : "Add Product"}
          </AppText>
          <AppText variant="body" color={colors.textSecondary} style={styles.heroText}>
            {showPicker
              ? "Choose a product from the list below to open the edit form."
              : "Fill the product details below and save them to inventory."}
          </AppText>
          {!showPicker ? (
            <AppText variant="caption" color={colors.textMuted} style={styles.heroHint}>
              Use the fields below to create or update a product.
            </AppText>
          ) : null}
        </View>

        {showPicker ? (
          <AppCard variant="soft" style={styles.formCard}>
            <ProductSearchInput value={pickerSearch} onChangeText={setPickerSearch} placeholder="Search product to edit..." />
            <ProductListView
              products={filteredProducts}
              onSelectProduct={(product) =>
                router.replace(`/product-form?mode=edit&productId=${product.id}`)
              }
              isLoading={loadingProducts}
            />
          </AppCard>
        ) : (
          <AppCard variant="soft" style={styles.formCard}>
            <View style={styles.fieldWrap}>
              <AppText variant="caption" color={colors.textSecondary}>
                Product Name
              </AppText>
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholder="Enter product name"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.fieldWrap}>
              <AppText variant="caption" color={colors.textSecondary}>
                Category
              </AppText>
              <TextInput
                value={category}
                onChangeText={setCategory}
                style={styles.input}
                placeholder="Enter product category"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <AppText variant="caption" color={colors.textSecondary}>
                  Buying Price
                </AppText>
                <TextInput
                  value={buyingPrice}
                  onChangeText={setBuyingPrice}
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.halfField}>
                <AppText variant="caption" color={colors.textSecondary}>
                  Selling Price
                </AppText>
                <TextInput
                  value={sellPrice}
                  onChangeText={setSellPrice}
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <AppText variant="caption" color={colors.textSecondary}>
                  Quantity
                </AppText>
                <TextInput
                  value={quantity}
                  onChangeText={setQuantity}
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                />
              </View>

              <View style={styles.halfField}>
                <AppText variant="caption" color={colors.textSecondary}>
                  Threshold Value
                </AppText>
                <TextInput
                  value={thresholdValue}
                  onChangeText={setThresholdValue}
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            <View style={styles.fieldWrap}>
              <AppText variant="caption" color={colors.textSecondary}>
                Expiry Date
              </AppText>
              <Pressable
                onPress={() => setNoExpiryDate((value) => !value)}
                style={[styles.checkboxRow, noExpiryDate && styles.checkboxRowActive]}
              >
                <View style={[styles.checkbox, noExpiryDate && styles.checkboxActive]}>
                  {noExpiryDate ? <View style={styles.checkboxDot} /> : null}
                </View>
                <AppText variant="body" color={colors.textPrimary}>
                  No expiry date
                </AppText>
              </Pressable>

              {!noExpiryDate ? (
                <TextInput
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textMuted}
                />
              ) : null}
            </View>

            <View style={styles.fieldWrap}>
              <AppText variant="caption" color={colors.textSecondary}>
                Availability Status
              </AppText>
              <View style={styles.readOnlyInput}>
                <AppText variant="body" color={colors.textSecondary}>
                  {availability}
                </AppText>
              </View>
            </View>

            <View style={styles.actionRow}>
              <AppButton
                title="Cancel"
                variant="secondary"
                onPress={() => router.back()}
                style={styles.actionBtn}
              />
              <AppButton
                title={isSaving ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
                onPress={onSave}
                disabled={isSaving}
                style={styles.actionBtn}
              />
            </View>
          </AppCard>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EAF3FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D8E7FF",
  },
  segmentWrap: {
    flex: 1,
    flexDirection: "row",
    gap: spacing.xs,
    backgroundColor: "#EEF4FF",
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: "#D8E7FF",
  },
  segment: {
    flex: 1,
    minHeight: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  segmentActive: {
    backgroundColor: colors.accentStrong,
  },
  heroCard: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  heroText: {
    marginTop: spacing.xs,
    maxWidth: 320,
  },
  heroHint: {
    marginTop: spacing.sm,
    maxWidth: 320,
  },
  formCard: {
    backgroundColor: "#F7FAFF",
    borderColor: "#DCE7F8",
  },
  fieldWrap: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#D8E2F0",
    borderRadius: 12,
    backgroundColor: "#EEF3FA",
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
  },
  checkboxRow: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: "#D8E2F0",
    borderRadius: 12,
    backgroundColor: "#EEF3FA",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  checkboxRowActive: {
    backgroundColor: "#E7F6EC",
    borderColor: colors.success,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  checkboxActive: {
    borderColor: colors.success,
    backgroundColor: colors.success,
  },
  checkboxDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
  },
  readOnlyInput: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: "#D8E2F0",
    borderRadius: 12,
    backgroundColor: "#EAF3FF",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  halfField: {
    flex: 1,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionBtn: {
    flex: 1,
  },
  successBanner: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.success,
    borderRadius: 12,
  },
  successText: {
    textAlign: "center",
  },
});
