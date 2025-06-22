import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Image, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { captureRef, captureScreen } from 'react-native-view-shot';

const { width, height } = Dimensions.get('window');

const OathScreen = ({ navigation, route }) => {
  const { avatar, equipments, vehicle } = route.params;
  const [showCertificate, setShowCertificate] = useState(false);
  const certificateRef = useRef(null);
  
  // Ekipman ve araç isimlerini düzgün formatta göster
  const getEquipmentNames = () => {
    if (!equipments || equipments.length === 0) return "ekipmanlar";
    
    const equipmentMap = {
      binoculars: "Sanal Dürbün",
      compass: "Sihirli Pusula",
      notebook: "Not Defteri",
      camera: "Fotoğraf Makinesi"
    };
    
    return equipments.map(eq => equipmentMap[eq] || eq).join(", ");
  };
  
  const getVehicleName = () => {
    const vehicleMap = {
      carpet: "Sihirli Halı",
      airplane: "Uçak",
      rocket: "Roket",
      balloon: "Sıcak Hava Balonu"
    };
    
    return vehicleMap[vehicle] || vehicle;
  };

  const handleTakeOath = () => {
    // Yemin etme animasyonu veya efekti burada olabilir
    setTimeout(() => {
      setShowCertificate(true);
    }, 500);
  };

  // Avatar görüntüleme HTML'i
  const getAvatarViewerHTML = () => {
    // Avatar URL'ini temizle
    const cleanAvatarUrl = avatar.avatarUrl.replace(/\\/g, '').replace(/"/g, '');
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              overflow: hidden; 
              width: 100vw; 
              height: 100vh; 
              background: transparent;
            }
            model-viewer { 
              width: 100%; 
              height: 100%; 
              --poster-color: transparent; 
              background-color: transparent;
            }
          </style>
        </head>
        <body>
          <model-viewer
            src="${cleanAvatarUrl}"
            camera-controls="false"
            auto-rotate="true"
            camera-orbit="0deg 75deg 105%"
            min-camera-orbit="auto auto 50%"
            max-camera-orbit="auto auto 200%"
            camera-target="0m 1m 0m"
            environment-image="neutral"
            shadow-intensity="1"
            exposure="1"
            style="background-color: transparent;"
          ></model-viewer>
        </body>
      </html>
    `;
  };

  // Sertifikayı görüntü olarak kaydetme ve paylaşma
  const saveCertificate = async () => {
    try {
      // İzin iste
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Sertifikayı kaydetmek için depolama izni gereklidir.');
        return;
      }

      // Ekranın tamamının görüntüsünü al
      const result = await captureScreen({
        format: 'jpg',
        quality: 0.9,
      });

      // Dosya adını oluştur
      const fileName = `${avatar.name}_DunyaKasifi_Sertifika_Ekran.jpg`;
      
      // Dosyayı kaydet
      const asset = await MediaLibrary.createAssetAsync(result);
      await MediaLibrary.createAlbumAsync('Dünya Kaşifi', asset, false);
      
      // Başarı mesajı göster
      Alert.alert(
        'Sertifika Kaydedildi!', 
        'Ekran görüntüsü galeriye kaydedildi. Şimdi paylaşmak ister misiniz?',
        [
          {
            text: 'Hayır',
            style: 'cancel',
          },
          {
            text: 'Paylaş',
            onPress: () => shareCertificate(result),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Hata', 'Ekran görüntüsü kaydedilirken bir hata oluştu: ' + error.message);
    }
  };

  // Sertifikayı paylaşma
  const shareCertificate = async (uri) => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Paylaşım Kullanılamıyor', 'Cihazınızda paylaşım özelliği kullanılamıyor.');
        return;
      }
      
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert('Hata', 'Sertifika paylaşılırken bir hata oluştu: ' + error.message);
    }
  };

  return (
    <LinearGradient
      colors={['#E3F2FD', '#BBDEFB']}
      style={styles.container}
    >
      {!showCertificate ? (
        <View style={styles.oathContainer}>
          <View style={styles.oathBox}>
            <View style={styles.oathHeader}>
              <Text style={styles.oathHeaderText}>Dünya Kaşifi Yemini</Text>
            </View>
            
            <View style={styles.oathContent}>
              <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>🌍</Text>
                <Text style={styles.emoji}>🤝</Text>
                <Text style={styles.emoji}>🔍</Text>
              </View>
              
              <Text style={styles.oathTitle}>Kaşif Yemini</Text>
              
              <View style={styles.oathTextContainer}>
                <Text style={styles.oathText}>
                  "Ben, <Text style={styles.oathHighlight}>{avatar.name}</Text>, bir Dünya Kaşifi olarak:"
                </Text>
                <Text style={styles.oathPoint}>• Yeni yerler keşfetmeye</Text>
                <Text style={styles.oathPoint}>• Merakla öğrenmeye</Text>
                <Text style={styles.oathPoint}>• Bilgilerimi paylaşmaya</Text>
                <Text style={styles.oathPoint}>• Doğayı korumaya</Text>
                <Text style={styles.oathText}>söz veriyorum!</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.oathButton} 
                onPress={handleTakeOath}
              >
                <Text style={styles.oathButtonText}>Yemin Ediyorum!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.certificateContainer}>
          <View style={styles.certificateBox}>
            <View style={styles.certificateHeader}>
              <Text style={styles.certificateHeaderText}>RESMİ BELGEDİR</Text>
            </View>
            
            <View style={styles.certificateContent}>
              <View 
                style={styles.certificateBorder}
                ref={certificateRef}
              >
                <View style={styles.certificateInner}>
                  <Text style={styles.certificateTitle}>Dünya Kaşifi Sertifikası</Text>
                  
                  <View style={styles.certificateImageContainer}>
                    <View style={styles.avatarContainer}>
                      <WebView
                        source={{ html: getAvatarViewerHTML() }}
                        style={styles.avatarWebView}
                        scrollEnabled={false}
                      />
                    </View>
                  </View>
                  
                  <Text style={styles.certificateName}>{avatar.name}</Text>
                  
                  <Text style={styles.certificateText}>
                    Yukarıda adı geçen kaşif, Dünya Kaşifi yeminini etmiş ve
                    <Text style={styles.certificateHighlight}> {getEquipmentNames()} </Text>
                    ekipmanlarını ve
                    <Text style={styles.certificateHighlight}> {getVehicleName()} </Text>
                    aracını kullanarak dünyayı keşfetmeye hak kazanmıştır.
                  </Text>
                  
                  <View style={styles.certificateStamp}>
                    <Text style={styles.certificateStampText}>ONAYLANDI</Text>
                  </View>
                  
                  <Text style={styles.certificateDate}>
                    {new Date().toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </View>
              </View>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.certificateButton} 
                  onPress={() => navigation.navigate('Map', { avatar, equipments, vehicle })}
                >
                  <Text style={styles.certificateButtonText}>Keşfe Başla!</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.certificateButton, styles.downloadButton]} 
                  onPress={saveCertificate}
                >
                  <Text style={styles.certificateButtonText}>Sertifikayı İndir 📥</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  // Yemin Ekranı Stilleri
  oathContainer: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  oathBox: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  oathHeader: {
    backgroundColor: '#1565C0',
    padding: 15,
    alignItems: 'center',
  },
  oathHeaderText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  oathContent: {
    padding: 25,
    alignItems: 'center',
  },
  emojiContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  emoji: {
    fontSize: 36,
    marginHorizontal: 10,
  },
  oathTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 20,
    textAlign: 'center',
  },
  oathTextContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    borderWidth: 2,
    borderColor: '#BBDEFB',
  },
  oathText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    color: '#1565C0',
    fontWeight: '500',
  },
  oathHighlight: {
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  oathPoint: {
    fontSize: 16,
    marginLeft: 15,
    marginVertical: 5,
    color: '#1976D2',
  },
  oathButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    marginTop: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  oathButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Sertifika Ekranı Stilleri
  certificateContainer: {
    width: '100%',
    maxWidth: 550,
    alignItems: 'center',
  },
  certificateBox: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  certificateHeader: {
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
  },
  certificateHeaderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  certificateContent: {
    padding: 20,
    alignItems: 'center',
  },
  certificateBorder: {
    borderWidth: 5,
    borderColor: '#4CAF50',
    borderRadius: 15,
    padding: 3,
    width: '100%',
  },
  certificateInner: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  certificateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
    textAlign: 'center',
  },
  certificateImageContainer: {
    width: 120,
    height: 120,
    marginVertical: 15,
    borderRadius: 60,
    backgroundColor: '#E8F5E9',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  avatarContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  avatarWebView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  certificateName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1565C0',
    marginVertical: 10,
  },
  certificateText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 15,
    lineHeight: 24,
    color: '#333',
  },
  certificateHighlight: {
    fontWeight: 'bold',
    color: '#1976D2',
  },
  certificateStamp: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#B71C1C',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    transform: [{ rotate: '-15deg' }],
    backgroundColor: 'rgba(183, 28, 28, 0.1)',
  },
  certificateStampText: {
    color: '#B71C1C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  certificateDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  certificateButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  certificateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  downloadButton: {
    backgroundColor: '#4CAF50',
  },
});

export default OathScreen;