import { useEffect } from "react";
import { Text, View } from "react-native";
import { productService } from "../../services/api";

export default function StockMovementsScreen() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await productService.getAll();
        console.log("Stock Movements api:", data);
      } catch (error) {
        console.error("Fetch hatası:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View>
      <Text>Stock Movements Screen</Text>
    </View>
  );
}