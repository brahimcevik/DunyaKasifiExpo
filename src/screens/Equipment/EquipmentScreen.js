import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const equipmentOptions = [
  { 
    id: 'binoculars', 
    name: 'Sanal Dürbün', 
    icon: '🔭', 
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'
  },
  { 
    id: 'compass', 
    name: 'Sihirli Pusula', 
    icon: '🧭', 
    modelUrl: ''
  },
  { 
    id: 'notebook', 
    name: 'Not Defteri', 
    icon: '📒', 
    modelUrl: ''
  },
  { 
    id: 'camera', 
    name: 'Fotoğraf Makinesi', 
    icon: '📷', 
    modelUrl: ''
  },
];

const EquipmentScreen = ({ navigation, route }) => {
  const { avatar } = route.params;
  const [selectedEquipments, setSelectedEquipments] = useState([]); // çoklu seçim
  
  // Avatar url temizle
  const cleanAvatarUrl = avatar.avatarUrl.replace(/\\/g, '').replace(/"/g, '');
  
  // Çoklu seçim fonksiyonu
  const toggleEquipment = (id) => {
    setSelectedEquipments(prev => {
      if (prev.includes(id)) {
        return prev.filter(eid => eid !== id);
      } else {
        // Maksimum 4 ekipman seçilebilir
        if (prev.length >= 4) {
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  // 3D model HTML (ekipman için varsa, yoksa emoji)
  const getEquipmentViewerHTML = (eq) => {
    if (eq && eq.modelUrl) {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
            <style>
              body { margin: 0; padding: 0; overflow: hidden; width: 100vw; height: 100vh; background: transparent; }
              model-viewer { 
                width: 100%; 
                height: 100%; 
                --poster-color: transparent; 
                background-color: transparent;
                --progress-bar-color: #1976D2;
                --progress-bar-height: 2px;
                --progress-mask: none;
              }
            </style>
          </head>
          <body>
            <model-viewer
              src="${eq.modelUrl}"
              camera-controls
              auto-rotate
              camera-orbit="0deg 75deg 105%"
              min-camera-orbit="auto auto 50%"
              max-camera-orbit="auto auto 200%"
              environment-image="neutral"
              shadow-intensity="1"
              exposure="1"
              loading="eager"
              reveal="interaction"
              style="background-color: transparent;"
            >
              <div class="progress-bar hide" slot="progress-bar">
                <div class="update-bar"></div>
              </div>
            </model-viewer>
            <script>
              const viewer = document.querySelector('model-viewer');
              viewer.addEventListener('error', (error) => {
                window.ReactNativeWebView.postMessage(JSON.stringify({ 
                  type: 'error', 
                  message: error.detail || 'Model yüklenemedi.'
                }));
              });
              viewer.addEventListener('load', () => {
                window.ReactNativeWebView.postMessage(JSON.stringify({ 
                  type: 'loaded' 
                }));
              });
            </script>
          </body>
        </html>
      `;
    }
    return null;
  };

  // Avatar viewer HTML (sağda sabit)
  const avatarViewerHTML = `
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
            background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
          }
          model-viewer { 
            width: 100%; 
            height: 100%; 
            --poster-color: transparent; 
            background-color: transparent; 
          }
          .stars {
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: -1;
            overflow: hidden;
          }
          .star {
            position: absolute;
            background-color: white;
            border-radius: 50%;
            opacity: 0.5;
          }
        </style>
      </head>
      <body>
        <div class="stars" id="stars"></div>
        <model-viewer
          src="${cleanAvatarUrl}"
          camera-controls
          auto-rotate
          camera-orbit="0deg 75deg 105%"
          min-camera-orbit="auto auto 50%"
          max-camera-orbit="auto auto 200%"
          camera-target="0m 1m 0m"
          environment-image="neutral"
          shadow-intensity="1"
          exposure="1"
          style="background-color: transparent;"
        ></model-viewer>
        <script>
          // Yıldız efekti oluştur
          const starsContainer = document.getElementById('stars');
          const starCount = 30;
          
          for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            // Rastgele boyut (1-3px)
            const size = Math.random() * 2 + 1;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            
            // Rastgele konum
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            
            // Rastgele parlaklık
            star.style.opacity = Math.random() * 0.7 + 0.3;
            
            starsContainer.appendChild(star);
          }
        </script>
      </body>
    </html>
  `;

  // Seçilen ekipmanları çanta olarak göster
  const renderEquipmentBag = () => {
    if (selectedEquipments.length === 0) {
      return (
        <View style={styles.emptyBagContainer}>
          <Text style={styles.bagEmoji}>🎒</Text>
          <Text style={styles.emptyBagText}>Ekipman çantan boş</Text>
          <Text style={styles.emptyBagSubtext}>Keşif için ekipman seç</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.bagContainer}>
        <View style={styles.bagHeader}>
          <View style={styles.bagTitleContainer}>
            <Text style={styles.bagEmoji}>🎒</Text>
            <Text style={styles.bagTitle}>Ekipman Çantan</Text>
          </View>
          <Text style={[
            styles.bagCount, 
            selectedEquipments.length === 4 && styles.bagCountFull
          ]}>
            {selectedEquipments.length}/4
          </Text>
        </View>
        <View style={styles.bagVisual}>
          <View style={styles.bagHandle} />
          <View style={styles.bagTop}>
            {/* Fermuar efekti */}
            {Array(8).fill().map((_, i) => (
              <View key={i} style={{
                width: 6,
                height: 6,
                backgroundColor: '#B71C1C',
                margin: 1,
                borderRadius: 1,
              }} />
            ))}
          </View>
          <View style={styles.bagBody}>
            <View style={styles.bagItemsContainer}>
              {selectedEquipments.map((eid, index) => {
                const eq = equipmentOptions.find(e => e.id === eid);
                return (
                  <View key={eid} style={styles.bagItem}>
                    <Text style={styles.bagItemIcon}>{eq.icon}</Text>
                    <Text style={styles.bagItemName}>{eq.name}</Text>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => toggleEquipment(eid)}
                    >
                      <Text style={styles.removeButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
              {selectedEquipments.length < 4 && (
                <View style={styles.emptySlotContainer}>
                  <Text style={styles.emptySlotText}>
                    {4 - selectedEquipments.length} ekipman daha seçebilirsin
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Keşif Ekipmanını Seç</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarTitleContainer}>
            <Text style={styles.avatarEmoji}>🦸</Text>
            <Text style={styles.avatarTitle}>Süper Kahraman Avatarın</Text>
            <Text style={styles.avatarEmoji}>⚡</Text>
          </View>
          <View style={styles.avatarFrame}>
            <WebView
              source={{ html: avatarViewerHTML }}
              style={styles.webview}
              scrollEnabled={false}
            />
            <View style={styles.avatarDecorationTop}></View>
            <View style={styles.avatarDecorationBottom}></View>
            <TouchableOpacity 
              style={styles.avatarLabel}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.avatarLabelText}>Avatar Seçimine Geri Dön</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.rightColumn}>
          <View style={styles.grid}>
            {equipmentOptions.map(eq => {
              const isSelected = selectedEquipments.includes(eq.id);
              const isDisabled = selectedEquipments.length >= 4 && !isSelected;
              return (
                <TouchableOpacity
                  key={eq.id}
                  style={[
                    styles.item, 
                    isSelected && styles.selected,
                    isDisabled && styles.disabled
                  ]}
                  onPress={() => !isDisabled && toggleEquipment(eq.id)}
                  disabled={isDisabled}
                >
                  {isSelected && <View style={styles.selectedBadge}><Text style={styles.selectedBadgeText}>✓</Text></View>}
                  <Text style={[styles.icon, isDisabled && styles.disabledText]}>{eq.icon}</Text>
                  <Text style={[styles.name, isDisabled && styles.disabledText]}>{eq.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.equipmentBagContainer}>
            {renderEquipmentBag()}
          </View>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, selectedEquipments.length === 0 && styles.disabledButton]}
          onPress={() => selectedEquipments.length > 0 && navigation.navigate('Vehicle', { avatar, equipments: selectedEquipments })}
          disabled={selectedEquipments.length === 0}
        >
          <Text style={styles.buttonText}>Devam Et</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  headerContainer: {
    paddingTop: 35, // Üst padding'i artıralım (20 -> 35)
    paddingBottom: 15, // Alt padding'i artıralım (10 -> 15)
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  buttonContainer: {
    paddingVertical: 20,
    width: '100%',
    marginBottom: 50,
  },
  rightColumn: {
    flex: 1, // Sağ sütunun genişliğini azaltalım (1.2 -> 1)
    marginLeft: 8,
    justifyContent: 'space-between',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avatarContainer: {
    flex: 1.2, // Avatar alanını genişletelim (0.8 -> 1.2)
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  avatarFrame: {
    flex: 1,
    position: 'relative',
    borderTopWidth: 0,
    borderColor: '#2196F3',
    overflow: 'hidden',
  },
  avatarDecorationTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 15,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(33, 150, 243, 0.3)',
  },
  avatarDecorationBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 15,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderTopWidth: 2,
    borderTopColor: 'rgba(33, 150, 243, 0.3)',
  },
  webview: {
    flex: 1,
  },
  item: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    padding: 8,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: '#1976D2',
    backgroundColor: '#E3F2FD',
  },
  icon: {
    fontSize: 28,
    marginBottom: 5,
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1976D2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#4CAF50',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'white',
  },
  selectedBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  equipmentBagContainer: {
    marginTop: 15,
    minHeight: 100,
  },
  bagEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  bagTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bagContainer: {
    borderRadius: 12,
    padding: 8,
    backgroundColor: 'transparent',
  },
  bagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
    paddingHorizontal: 3,
  },
  bagVisual: {
    position: 'relative',
  },
  bagTop: {
    height: 15, // Yüksekliği artıralım (12 -> 15)
    backgroundColor: '#D32F2F',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 2,
    borderColor: '#B71C1C',
    overflow: 'hidden',
    flexDirection: 'row', // Fermuar için
    justifyContent: 'center',
    alignItems: 'center',
  },
  bagBody: {
    backgroundColor: '#F44336',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#B71C1C',
    padding: 8,
    paddingTop: 10,
    minHeight: 100,
    position: 'relative', // Çanta detayları için
  },
  bagHandle: {
    position: 'absolute',
    top: -10,
    left: '30%',
    right: '30%',
    height: 20,
    borderWidth: 2,
    borderColor: '#B71C1C',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#D32F2F',
    zIndex: -1,
  },
  emptyBagContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BBDEFB',
    borderStyle: 'dashed',
    minHeight: 150,
  },
  emptyBagText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
    marginTop: 10,
  },
  emptyBagSubtext: {
    fontSize: 14,
    color: '#757575',
  },
  bagTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  bagCount: {
    fontSize: 14,
    color: '#757575',
    fontWeight: 'bold',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  bagCountFull: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  bagItemsContainer: {
    flexDirection: 'column',
  },
  bagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFCDD2',
    borderRadius: 8,
    padding: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#E57373',
  },
  bagItemIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  bagItemName: {
    flex: 1,
    fontSize: 12,
    color: '#B71C1C',
    fontWeight: '500',
  },
  removeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E57373',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptySlotContainer: {
    backgroundColor: 'rgba(255, 205, 210, 0.7)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E57373',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  emptySlotText: {
    fontSize: 14,
    color: '#B71C1C',
    fontStyle: 'italic',
  },
  disabled: {
    opacity: 0.5,
    borderColor: '#ccc',
  },
  disabledText: {
    color: '#999',
  },
  avatarTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 8,
  },
  avatarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginHorizontal: 5,
  },
  avatarEmoji: {
    fontSize: 20,
  },
  avatarLabel: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLabelText: {
    backgroundColor: 'rgba(33, 150, 243, 0.7)',
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default EquipmentScreen;