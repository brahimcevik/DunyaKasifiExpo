# 🚀 Kurulum Rehberi

Bu rehber, Dünya Kaşifi mobil uygulamasını kendi bilgisayarınızda çalıştırmak için gerekli adımları içerir.

---

## 1. Gereksinimler

- Node.js (v16 veya üzeri)
- npm (Node Package Manager)
- Git
- Expo CLI (global olarak yüklenmeli)

## 2. Projeyi Klonlayın

```bash
git clone https://github.com/brahimcevik/DunyaKasifiExpo.git
cd DunyaKasifiExpo
```

## 3. Bağımlılıkları Yükleyin

```bash
npm install
```

## 4. Expo CLI Kurulumu (Eğer yüklü değilse)

```bash
npm install -g expo-cli
```

## 5. Uygulamayı Başlatın

```bash
npx expo start
```

Bu komut ile Expo geliştirici arayüzü açılır. Buradan QR kodu telefonunuzdaki Expo Go uygulaması ile okutarak uygulamayı test edebilirsiniz.

## 6. Android/iOS Cihazda Test Etme
- Android: Google Play'den "Expo Go" uygulamasını indirin.
- iOS: App Store'dan "Expo Go" uygulamasını indirin.
- Expo arayüzündeki QR kodunu telefonunuzla okutun.

## 7. APK Oluşturma (Opsiyonel)

Eğer uygulamanın APK dosyasını oluşturmak isterseniz:

```bash
npx expo build:android
```
veya yeni Expo sürümlerinde:
```bash
npx expo run:android
```

## 8. Sorun Giderme
- Node.js ve npm sürümlerinizin güncel olduğundan emin olun.
- Android Studio veya Xcode yüklü ise, cihaz emülatörü üzerinden de test edebilirsiniz.
- Hata alırsanız terminaldeki hata mesajlarını dikkatlice inceleyin.

---

## ℹ️ Referans
Daha fazla bilgi ve uygulamanın web arayüzü için:
[https://brahimcevik.github.io/kids-explorer-armslt.github.io/](https://brahimcevik.github.io/kids-explorer-armslt.github.io/) 