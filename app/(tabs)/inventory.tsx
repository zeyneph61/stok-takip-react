import { useEffect } from "react";
import { Text, View } from "react-native";
import { inventoryService } from "../../services/inventoryService";

export default function InventoryScreen() {
  useEffect(() => {
    const fetchData = async () => {
      const data = await inventoryService.getProducts();
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