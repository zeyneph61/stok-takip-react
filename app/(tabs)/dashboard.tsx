import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { productService, stockMovementService } from "../../services/api";

export default function DashboardScreen() {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [movementCount, setMovementCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, movements] = await Promise.all([
          productService.getAll(),
          stockMovementService.getAll(),
        ]);

        setProductCount(Array.isArray(products) ? products.length : null);
        setMovementCount(Array.isArray(movements) ? movements.length : null);
      } catch (error) {
        console.error("Dashboard fetch hatası:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View>
      <Text>Dashboard Screen</Text>
      <Text>Ürün sayısı: {productCount ?? "Yükleniyor"}</Text>
      <Text>Stok hareketi sayısı: {movementCount ?? "Yükleniyor"}</Text>
    </View>
  );
}
