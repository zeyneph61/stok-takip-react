import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import AppButton from "../components/common/AppButton";
import AppCard from "../components/common/AppCard";
import AppText from "../components/common/AppText";
import ScreenWrapper from "../components/common/ScreenWrapper";
import ProductListView from "../components/inventory/ProductListView";
import ProductSearchInput from "../components/inventory/ProductSearchInput";
import { ApiError } from "../services/api";
import { inventoryService } from "../services/inventoryService";
import { colors, spacing } from "../theme";
import { Product } from "../types/product";

type Mode = "add" | "edit";
type FormErrors = {
  name?: string;
  category?: string;
  buyingPrice?: string;
  sellPrice?: string;
  quantity?: string;
  thresholdValue?: string;
  expiryDate?: string;
};

const EDIT_PICKER_INITIAL_LIMIT = 24;

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function isDeleteRelationConflict(details?: string) {
  if (!details) return false;

  return /(FK_StockMovements_Products|REFERENCE constraint|StockMovement|ProductId)/i.test(
    details
  );
}

export default function ProductFormScreen() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode: Mode = params.mode === "edit" ? "edit" : "add";

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined);
  const [pickerSearch, setPickerSearch] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [thresholdValue, setThresholdValue] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [noExpiryDate, setNoExpiryDate] = useState(false);
  const [originalQuantity, setOriginalQuantity] = useState(0);
  const [originalSku, setOriginalSku] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const isEditMode = useMemo(() => mode === "edit", [mode]);
  const showPicker = isEditMode && !selectedProductId;

  const resetFormFields = () => {
    setName("");
    setCategory("");
    setBuyingPrice("");
    setSellPrice("");
    setQuantity("");
    setThresholdValue("");
    setExpiryDate("");
    setNoExpiryDate(false);
    setFormErrors({});
    setErrorMessage("");
    setSuccessMessage("");
  };

  const openAddMode = () => {
    setSelectedProductId(undefined);
    setPickerSearch("");
    resetFormFields();
    router.replace("/product-form?mode=add");
  };

  const openEditMode = () => {
    setSelectedProductId(undefined);
    setPickerSearch("");
    resetFormFields();
    router.replace("/product-form?mode=edit");
  };

  const availability = useMemo(() => {
    const stock = toNumber(quantity);
    const threshold = toNumber(thresholdValue);

    if (stock <= 0) return "Out of Stock";
    if (stock <= threshold) return "Low Stock";
    return "In Stock";
  }, [quantity, thresholdValue]);

  const normalizedPickerSearch = useMemo(
    () => pickerSearch.trim().toLowerCase(),
    [pickerSearch]
  );

  const filteredProducts = useMemo(() => {
    // Only show products with quantity > 0 (hide soft-deleted)
    const activeProducts = products.filter(p => p.quantity > 0);
    
    if (!normalizedPickerSearch) {
      // Keep first paint fast on edit screen when product count is high.
      return activeProducts.slice(0, EDIT_PICKER_INITIAL_LIMIT);
    }

    return activeProducts.filter((item) =>
      item.name.toLowerCase().includes(normalizedPickerSearch)
    );
  }, [normalizedPickerSearch, products]);

  useEffect(() => {
    if (!showPicker) {
      return;
    }

    const fetchProducts = async () => {
      const cachedProducts = inventoryService.getCachedProducts();
      if (cachedProducts?.length) {
        setProducts(cachedProducts);
        setLoadingProducts(false);
      } else {
        setLoadingProducts(true);
      }

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
  }, [showPicker]);

  useEffect(() => {
    if (!selectedProductId) {
      return;
    }

    const fetchProduct = async () => {
      try {
        const product = await inventoryService.getProductById(selectedProductId);
        setName(product.name ?? "");
        setCategory(product.category ?? "");
        setBuyingPrice(String(product.buyingPrice ?? ""));
        setSellPrice(String(product.sellPrice ?? product.price ?? ""));
        const qty = product.quantity ?? 0;
        setQuantity(String(qty));
        setOriginalQuantity(qty);
        setOriginalSku(product.sku ?? "");
        setThresholdValue(String(product.thresholdValue ?? ""));
        const nextExpiryDate = product.expiryDate ? String(product.expiryDate).slice(0, 10) : "";
        setExpiryDate(nextExpiryDate);
        setNoExpiryDate(!nextExpiryDate);
      } catch (error) {
        console.error("Product detail fetch error:", error);
      }
    };

    fetchProduct();
  }, [selectedProductId]);

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!name.trim()) {
      nextErrors.name = "Product name is required.";
    }

    if (!category.trim()) {
      nextErrors.category = "Category is required.";
    }

    const parsedBuying = Number(buyingPrice);
    if (!buyingPrice.trim()) {
      nextErrors.buyingPrice = "Buying price is required.";
    } else if (!Number.isFinite(parsedBuying) || parsedBuying < 0) {
      nextErrors.buyingPrice = "Buying price must be a valid non-negative number.";
    }

    const parsedSelling = Number(sellPrice);
    if (!sellPrice.trim()) {
      nextErrors.sellPrice = "Selling price is required.";
    } else if (!Number.isFinite(parsedSelling) || parsedSelling < 0) {
      nextErrors.sellPrice = "Selling price must be a valid non-negative number.";
    }

    const parsedQuantity = Number(quantity);
    if (!quantity.trim()) {
      nextErrors.quantity = "Quantity is required.";
    } else if (!Number.isFinite(parsedQuantity) || parsedQuantity < 0) {
      nextErrors.quantity = "Quantity must be a valid non-negative number.";
    }

    const parsedThreshold = Number(thresholdValue);
    if (thresholdValue.trim() && (!Number.isFinite(parsedThreshold) || parsedThreshold < 0)) {
      nextErrors.thresholdValue = "Threshold value must be a valid non-negative number.";
    }

    if (!noExpiryDate) {
      if (!expiryDate.trim()) {
        nextErrors.expiryDate = "Expiry date is required or select no expiry date.";
      } else if (!/^\d{4}-\d{2}-\d{2}$/.test(expiryDate.trim())) {
        nextErrors.expiryDate = "Expiry date must be in YYYY-MM-DD format.";
      } else {
        const parsedDate = new Date(expiryDate);
        if (Number.isNaN(parsedDate.getTime())) {
          nextErrors.expiryDate = "Expiry date is invalid.";
        }
      }
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveProduct = async () => {
    setErrorMessage("");
    setIsSaving(true);
    try {
      const basePayload: Partial<Product> = {
        ...(isEditMode && selectedProductId ? { id: selectedProductId } : {}),
        name: name.trim(),
        category: category.trim(),
        sku: isEditMode ? originalSku || "-" : "-",
        buyingPrice: toNumber(buyingPrice),
        sellPrice: toNumber(sellPrice),
        price: toNumber(sellPrice),
        quantity: toNumber(quantity),
        thresholdValue: toNumber(thresholdValue),
        availability,
        expiryDate: noExpiryDate ? undefined : expiryDate ? new Date(expiryDate).toISOString() : undefined,
      };

      console.log("[SAVE] Payload:", JSON.stringify(basePayload));

      if (isEditMode && selectedProductId) {
        await inventoryService.updateProduct(selectedProductId, basePayload);
      } else {
        await inventoryService.createProduct(
          basePayload as Omit<Product, "id" | "createdDate" | "modifiedDate">
        );
      }

      setSuccessMessage(isEditMode ? "Product updated successfully!" : "Product created successfully!");
      setTimeout(() => {
        router.back();
      }, 1200);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error("[SAVE] Status:", error.status, "| Backend mesajı:", error.details);
      } else {
        console.error("[SAVE] Beklenmeyen hata:", error);
      }
      setErrorMessage("We could not save the product. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const onSave = async () => {
    if (!validateForm()) {
      setErrorMessage("Please fix the highlighted fields before continuing.");
      return;
    }

    if (isEditMode) {
      if (Platform.OS === "web") {
        const confirmed = window.confirm("Do you want to save changes for this product?");
        if (confirmed) {
          await saveProduct();
        }
        return;
      }
      Alert.alert("Confirm Update", "Do you want to save changes for this product?", [
        { text: "Cancel", style: "cancel" },
        { text: "Update", onPress: () => void saveProduct() },
      ]);
      return;
    }

    await saveProduct();
  };

  const performDelete = async () => {
    console.log(">>> [DELETE] performDelete called");
    setErrorMessage("");
    setIsDeleting(true);
    try {
      console.log(`[DELETE] Starting delete for product ID: ${selectedProductId}`);
      const result = await inventoryService.deleteProduct(selectedProductId!);
      console.log(`[DELETE] Success! Result:`, result);
      setSuccessMessage("Product deleted successfully!");
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error) {
      console.log(`[DELETE] Error caught:`, error);
      if (error instanceof ApiError) {
        console.log(`[DELETE] API Error - Status: ${error.status}, Details: ${error.details}`);
        if (error.status === 409 || isDeleteRelationConflict(error.details)) {
          setErrorMessage("This product cannot be deleted right now.");
        } else if (error.status === 404) {
          setErrorMessage("Product could not be found.");
        } else {
          setErrorMessage("Delete failed on server. Please try again later.");
        }
      } else {
        setErrorMessage("We could not delete the product. Please try again.");
      }
    } finally {
      console.log(">>> [DELETE] performDelete finally block");
      setIsDeleting(false);
    }
  };

  const onDelete = () => {
    if (!selectedProductId) {
      return;
    }

    if (Platform.OS === "web") {
      // Alert.alert web'de window.confirm() kullanır ve callback zinciri çalışmayabilir.
      // eslint-disable-next-line no-alert
      const confirmed = window.confirm("This product will be permanently removed. Continue?");
      if (confirmed) {
        void performDelete();
      }
      return;
    }

    Alert.alert("Confirm Delete", "This product will be permanently removed. Continue?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => void performDelete(),
      },
    ]);
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

        {errorMessage ? (
          <View style={styles.errorBanner}>
            <AppText variant="body" color={colors.white} style={styles.successText}>
              {errorMessage}
            </AppText>
          </View>
        ) : null}

        <View style={styles.topBar}>
          <Pressable
            onPress={() => {
              if (isEditMode && selectedProductId) {
                setSelectedProductId(undefined);
                setPickerSearch("");
                resetFormFields();
                return;
              }
              router.back();
            }}
            style={styles.backButton}
          >
            <AppText variant="cardTitle" color={colors.textPrimary}>
              ←
            </AppText>
          </Pressable>

          <View style={styles.segmentWrap}>
            <Pressable
              onPress={openAddMode}
              style={[styles.segment, !isEditMode && styles.segmentActive]}
            >
              <AppText variant="caption" color={!isEditMode ? colors.white : colors.textSecondary}>
                Add Product
              </AppText>
            </Pressable>
            <Pressable
              onPress={openEditMode}
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
            {!normalizedPickerSearch && products.length > EDIT_PICKER_INITIAL_LIMIT ? (
              <AppText variant="caption" color={colors.textMuted} style={styles.pickerHint}>
                Showing first {EDIT_PICKER_INITIAL_LIMIT} products. Type to search in all products.
              </AppText>
            ) : null}
            <ProductListView
              products={filteredProducts}
              onSelectProduct={(product) => setSelectedProductId(product.id)}
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
                style={[styles.input, formErrors.name && styles.inputError]}
                placeholder="Enter product name"
                placeholderTextColor={colors.textMuted}
              />
              {formErrors.name ? (
                <AppText variant="caption" color={colors.danger}>
                  {formErrors.name}
                </AppText>
              ) : null}
            </View>

            <View style={styles.fieldWrap}>
              <AppText variant="caption" color={colors.textSecondary}>
                Category
              </AppText>
              <TextInput
                value={category}
                onChangeText={setCategory}
                style={[styles.input, formErrors.category && styles.inputError]}
                placeholder="Enter product category"
                placeholderTextColor={colors.textMuted}
              />
              {formErrors.category ? (
                <AppText variant="caption" color={colors.danger}>
                  {formErrors.category}
                </AppText>
              ) : null}
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <AppText variant="caption" color={colors.textSecondary}>
                  Buying Price
                </AppText>
                <TextInput
                  value={buyingPrice}
                  onChangeText={setBuyingPrice}
                  style={[styles.input, formErrors.buyingPrice && styles.inputError]}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                />
                {formErrors.buyingPrice ? (
                  <AppText variant="caption" color={colors.danger}>
                    {formErrors.buyingPrice}
                  </AppText>
                ) : null}
              </View>

              <View style={styles.halfField}>
                <AppText variant="caption" color={colors.textSecondary}>
                  Selling Price
                </AppText>
                <TextInput
                  value={sellPrice}
                  onChangeText={setSellPrice}
                  style={[styles.input, formErrors.sellPrice && styles.inputError]}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                />
                {formErrors.sellPrice ? (
                  <AppText variant="caption" color={colors.danger}>
                    {formErrors.sellPrice}
                  </AppText>
                ) : null}
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
                  style={[styles.input, formErrors.quantity && styles.inputError]}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                />
                {formErrors.quantity ? (
                  <AppText variant="caption" color={colors.danger}>
                    {formErrors.quantity}
                  </AppText>
                ) : null}
              </View>

              <View style={styles.halfField}>
                <AppText variant="caption" color={colors.textSecondary}>
                  Threshold Value
                </AppText>
                <TextInput
                  value={thresholdValue}
                  onChangeText={setThresholdValue}
                  style={[styles.input, formErrors.thresholdValue && styles.inputError]}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                />
                {formErrors.thresholdValue ? (
                  <AppText variant="caption" color={colors.danger}>
                    {formErrors.thresholdValue}
                  </AppText>
                ) : null}
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
                  style={[styles.input, formErrors.expiryDate && styles.inputError]}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textMuted}
                />
              ) : null}
              {formErrors.expiryDate ? (
                <AppText variant="caption" color={colors.danger}>
                  {formErrors.expiryDate}
                </AppText>
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
                containerStyle={styles.cancelBtn}
                onPress={() => {
                  if (isEditMode && selectedProductId) {
                    setSelectedProductId(undefined);
                    setPickerSearch("");
                    resetFormFields();
                    return;
                  }
                  router.back();
                }}
                disabled={isSaving || isDeleting}
              />
              <AppButton
                title={isSaving ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
                containerStyle={styles.actionBtn}
                onPress={onSave}
                disabled={isSaving || isDeleting}
              />
            </View>

            {isEditMode && selectedProductId ? (
              <View style={styles.deleteRow}>
                <AppButton
                  title={isDeleting ? "Deleting..." : "Delete Product"}
                  variant="danger"
                  containerStyle={styles.deleteBtn}
                  onPress={onDelete}
                  disabled={isSaving || isDeleting}
                />
              </View>
            ) : null}
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
  pickerHint: {
    marginBottom: spacing.sm,
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
  inputError: {
    borderColor: colors.danger,
    backgroundColor: "#FFF2F4",
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
  deleteRow: {
    marginTop: spacing.xs,
  },
  actionBtn: {
    flex: 1,
  },
  cancelBtn: {
    flex: 0.65,
  },
  deleteBtn: {
    width: "100%",
  },
  successBanner: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.success,
    borderRadius: 12,
  },
  errorBanner: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.danger,
    borderRadius: 12,
  },
  successText: {
    textAlign: "center",
  },
});
