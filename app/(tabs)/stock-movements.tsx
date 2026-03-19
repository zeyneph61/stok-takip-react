import { StyleSheet, Text, View } from 'react-native';

export default function StockMovementsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stock Movements</Text>
      <Text>Bu ekran stok giriş çıkış hareketlerini gösterecek.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});