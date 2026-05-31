# Stok Takip Uygulaması

React Native (Expo) ile geliştirilmiş mobil stok takip uygulaması.

**Geliştirici:** Zeynep Hacısalihoğlu  
**Ders:** IOS2 – Mobil Uygulama Geliştirme  
**Dönem:** 2025–2026

---

## Uygulama Hakkında

Bu uygulama; ürün envanterini yönetmek, stok giriş/çıkış hareketlerini takip etmek ve genel stok durumunu tek ekranda izlemek amacıyla geliştirilmiştir. Var olan bir backend API'ye bağlanarak gerçek zamanlı veri çekmektedir.

---

## Özellikler

- **Dashboard:** Toplam ürün, düşük stok, süresi yaklaşan ve tükenmiş ürün sayıları; en çok satan kategoriler
- **Envanter Yönetimi:** Ürün listeleme, ada ve kategoriye göre arama/filtreleme
- **Ürün Formu:** Yeni ürün ekleme ve mevcut ürünü düzenleme/silme; alan doğrulama ve onay diyaloğu
- **Stok Hareketleri:** Giriş/çıkış hareketlerini listeleme; hareket tipine ve tarihe göre filtreleme
- **Pull-to-Refresh:** Tüm ekranlarda aşağı çekerek verileri yenileme
- **Tutarlı Tasarım:** Özel renk paleti, Poppins font ailesi ve yeniden kullanılabilir bileşen kütüphanesi

---

## Kullanılan Teknolojiler

| Teknoloji | Versiyon |
|---|---|
| React Native | 0.81.5 |
| Expo | ~54 |
| Expo Router | ~6 |
| TypeScript | ~5.9 |
| React Navigation (Bottom Tabs) | ^7 |

---

## Klasör Yapısı

```
stok-takip-react/
├── app/
│   ├── (tabs)/
│   │   ├── dashboard.tsx        # Ana dashboard ekranı
│   │   ├── inventory.tsx        # Envanter listesi
│   │   ├── stock-movements.tsx  # Stok hareketleri
│   │   └── _layout.tsx          # Tab navigasyon yapısı
│   ├── product-form.tsx         # Ürün ekleme/düzenleme formu
│   ├── index.tsx                # Giriş yönlendirme
│   └── _layout.tsx              # Kök layout
├── components/
│   ├── common/                  # AppText, AppCard, AppButton vb.
│   ├── dashboard/               # Dashboard'a özel kartlar
│   ├── inventory/               # Ürün listesi bileşenleri
│   └── stock-movements/         # Stok hareketi bileşenleri
├── services/
│   ├── api.ts                   # Axios temel yapılandırması
│   ├── dashboardService.ts
│   ├── inventoryService.ts
│   ├── productService.ts
│   ├── stockService.ts
│   └── stockMovementsService.ts
├── types/                       # TypeScript tip tanımları
├── theme/                       # Renkler, fontlar, boşluk sabitleri
├── Raporlar/                    # Haftalık ilerleme raporları
└── assets/                      # Görseller ve ikonlar
```

---

## Kurulum ve Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Expo geliştirme sunucusunu başlat
npm start

# Android için
npm run android

# iOS için
npm run ios
```

> Uygulamayı fiziksel cihazda test etmek için **Expo Go** uygulamasını indirip QR kodu okutun.

---

## Haftalık İlerleme

Tüm haftalara ait açıklama videoları YouTube oynatma listesinde mevcuttur:  
**Oynatma Listesi:** https://www.youtube.com/playlist?list=PLXF3AC37_V3V8zHzX1ciSraWMQpOIlINQ

| Hafta | Konu | Video |
|---|---|---|
| 1. Hafta | Ortam kurulumu, klasör yapısı, ilk ekranlar | [İzle](https://youtu.be/DgCKox4bDX4) |
| 2. Hafta | Tema (renkler, fontlar), AppText ve AppCard bileşenleri | [İzle](https://youtu.be/wGZm5tXIeFg) |
| 3. Hafta | Backend bağlantısı (api.ts), ortak bileşenler | [İzle](https://youtu.be/J7jQANgrHfI) |
| 4. Hafta | Dashboard ekranı, metrik kartlar, best sellers | [İzle](https://youtu.be/wVfkNKtpt1o) |
| 5. Hafta | Inventory ekranı, arama ve kategori filtresi | [İzle](https://youtu.be/DgCKox4bDX4) |
| 6. Hafta | Product Form (ekleme/düzenleme/silme), form doğrulama | [İzle](https://youtu.be/EDlkGykJcrw) |
| 7. Hafta | Stock Movements ekranı, filtreleme, özet istatistikler | [İzle](https://youtu.be/3Z95ZThmeaY?si=eeq0QFF8dcpc8mSb) |
| 8. Hafta | Pull-to-refresh, animasyonlar, UI iyileştirmeleri | [İzle](https://youtu.be/Ed9qFvg3Ua0?si=_-_sXOsNNYwsSCG1) |
| 9. Hafta | Genel test, hata düzeltmeleri, kod temizliği | [İzle](https://youtu.be/2JY7rNLz5ko?si=vUyhoOsCkZpKhXg0) |
| 10. Hafta | Proje tamamlama, dokümantasyon, sunum hazırlığı | — |
