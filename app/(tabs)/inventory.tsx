import { useEffect } from "react";
import { Text, View } from "react-native";
import { productService } from "../../services/api";

export default function InventoryScreen() {
  useEffect(() => {
    const fetchData = async () => {
      const data = await productService.getAll();
      console.log("Products api:", data);
    };

    fetchData();
  }, []);

  return (
    <View>
      <Text>Inventory Screen</Text>
    </View>
  );
}