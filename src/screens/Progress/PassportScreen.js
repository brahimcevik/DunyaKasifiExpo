import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions, 
  StatusBar, 
  Platform,
  ScrollView,
  Animated,
  Image
} from 'react-native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

const badges = [
  { 
    id: 'eiffel', 
    name: 'Eyfel Rozeti', 
    icon: '🗼', 
    location: 'Paris',
    description: 'Eyfel Kulesini keşfettin!',
    date: '10 Mayıs 2025',
    color: '#FF9800',
    unlocked: true
  },
  { 
    id: 'bigben', 
    name: 'Big Ben Rozeti', 
    icon: '🎡', 
    location: 'Londra',
    description: 'Big Ben ve Thames Nehrini keşfettin!',
    date: '11 Mayıs 2025',
    color: '#4CAF50',
    unlocked: true
  },
  { 
    id: 'colosseum', 
    name: 'Kolezyum Rozeti', 
    icon: '🏛️', 
    location: 'Roma',
    description: 'Kolezyum ve antik Roma\'yı keşfettin!',
    date: '',
    color: '#9C27B0',
    unlocked: false
  },
  { 
    id: 'cloud', 
    name: 'Bulut Boyama Rozeti', 
    icon: '☁️', 
    location: 'Gökyüzü',
    description: 'Bulutları renklendirdin!',
    date: '',
    color: '#2196F3',
    unlocked: false
  },
];

const PassportScreen = ({ navigation, route }) => {
  const { avatar, equipments, vehicle } = route.params || {};
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [scaleAnim] = useState(new Animated.Value(0.95));
  const [fadeAnim] = useState(new Animated.Value(0));
  
  // React Navigation başlık çubuğunu gizle
  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        headerShown: false,
      });
    }, [navigation])
  );
  
  // Animasyonları başlat
  useEffect(() => {
    // Kart ölçeklendirme animasyonu
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
    
    // Fade-in animasyonu
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Avatar görüntüleme fonksiyonu
  const renderAvatar = () => {
    if (!avatar?.avatarUrl) return null;
    
    // Avatar URL'ini temizle
    const cleanAvatarUrl = avatar.avatarUrl.replace(/\\/g, '').replace(/"/g, '');
    
    return (
      <View style={styles.avatarContainer}>
        <WebView
          source={{ 
            html: `
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
            `
          }}
          style={styles.avatarViewer}
          scrollEnabled={false}
        />
      </View>
    );
  };
  
  // Rozet kartı render fonksiyonu
  const renderBadgeItem = (badge, index) => {
    const delay = index * 100; // Her kart için kademeli gecikme
    
    return (
      <Animated.View 
        key={badge.id}
        style={[
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.badgeItem,
            selectedBadge?.id === badge.id && styles.selectedBadgeItem
          ]}
          activeOpacity={0.7}
          onPress={() => setSelectedBadge(badge)}
          disabled={!badge.unlocked}
        >
          <View 
            style={[
              styles.badgeIconContainer, 
              { backgroundColor: badge.unlocked ? badge.color : '#E0E0E0' }
            ]}
          >
            <Text style={styles.badgeIcon}>{badge.icon}</Text>
            {!badge.unlocked && (
              <View style={styles.lockedOverlay}>
                <MaterialIcons name="lock" size={24} color="rgba(255,255,255,0.8)" />
              </View>
            )}
          </View>
          <Text 
            style={[
              styles.badgeName,
              !badge.unlocked && styles.lockedBadgeName
            ]}
          >
            {badge.name}
          </Text>
          {badge.unlocked && (
            <Text style={styles.badgeLocation}>{badge.location}</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  // Seçili rozet detayları
  const renderBadgeDetails = () => {
    if (!selectedBadge) return null;
    
    return (
      <Animated.View 
        style={[
          styles.badgeDetails,
          { 
            opacity: fadeAnim,
            backgroundColor: `${selectedBadge.color}20`, // %20 opaklık
            borderColor: selectedBadge.color
          }
        ]}
      >
        <View style={styles.badgeDetailHeader}>
          <Text style={[styles.badgeDetailTitle, { color: selectedBadge.color }]}>
            {selectedBadge.name}
          </Text>
          <Text style={styles.badgeDetailIcon}>{selectedBadge.icon}</Text>
        </View>
        
        <Text style={styles.badgeDetailDescription}>
          {selectedBadge.description}
        </Text>
        
        {selectedBadge.date && (
          <View style={styles.badgeDetailDate}>
            <FontAwesome5 name="calendar-alt" size={14} color="#555" />
            <Text style={styles.badgeDetailDateText}>
              Kazanıldı: {selectedBadge.date}
            </Text>
          </View>
        )}
      </Animated.View>
    );
  };

  // Pasaport sahibi bilgisi
  const renderPassportOwner = () => {
    return (
      <View style={styles.passportOwner}>
        <View style={styles.ownerInfo}>
          <Text style={styles.ownerLabel}>Pasaport Sahibi</Text>
          <Text style={styles.ownerName}>{avatar?.name || 'Adsız Kaşif'}</Text>
          <Text style={styles.passportId}>ID: DK-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</Text>
        </View>
        {renderAvatar()}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1976D2" barStyle="light-content" translucent={false} />
      <LinearGradient
        colors={['#1976D2', '#2196F3', '#64B5F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <FontAwesome5 name="passport" size={24} color="#FFF" style={{marginRight: 10}} />
            <Text style={styles.title}>Kaşif Pasaportu</Text>
          </View>
          
          <View style={{width: 24}} />
        </View>
      </LinearGradient>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderPassportOwner()}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <FontAwesome5 name="medal" size={16} color="#1976D2" /> Kazandığın Rozetler
          </Text>
          
          <View style={styles.badgeGrid}>
            {badges.map((badge, index) => renderBadgeItem(badge, index))}
          </View>
        </View>
        
        {renderBadgeDetails()}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <FontAwesome5 name="suitcase" size={16} color="#1976D2" /> Ekipmanların
          </Text>
          
          <View style={styles.equipmentList}>
            {equipments && equipments.length > 0 ? (
              equipments.map((item, index) => (
                <View key={index} style={styles.equipmentItem}>
                  <Text style={styles.equipmentIcon}>{item.icon || '🎒'}</Text>
                  <Text style={styles.equipmentName}>{item.name}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyMessage}>Henüz ekipman seçmedin</Text>
            )}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <FontAwesome5 name="plane" size={16} color="#1976D2" /> Aracın
          </Text>
          
          <View style={styles.vehicleContainer}>
            {vehicle ? (
              <>
                <Text style={styles.vehicleIcon}>{vehicle.icon || '✈️'}</Text>
                <Text style={styles.vehicleName}>{vehicle.name || 'Standart Uçak'}</Text>
              </>
            ) : (
              <Text style={styles.emptyMessage}>Henüz araç seçmedin</Text>
            )}
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => navigation.navigate('Map', { avatar, equipments, vehicle })}
        >
          <FontAwesome5 name="map-marked-alt" size={16} color="#1976D2" style={styles.buttonIcon} />
          <Text style={styles.secondaryButtonText}>Haritaya Dön</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Summary', { avatar, equipments, vehicle })}
        >
          <FontAwesome5 name="plane-arrival" size={16} color="#FFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Uçuşu Bitir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight - 5 : 0,
  },
  headerGradient: {
    paddingTop: 5,
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // Butonlar için yer bırak
  },
  passportOwner: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ownerInfo: {
    flex: 1,
  },
  ownerLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  ownerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 4,
  },
  passportId: {
    fontSize: 12,
    color: '#757575',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  avatarContainer: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#1976D2',
  },
  avatarViewer: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 16,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeItem: {
    width: '48%',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedBadgeItem: {
    borderWidth: 2,
    borderColor: '#1976D2',
  },
  badgeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  badgeIcon: {
    fontSize: 30,
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  lockedBadgeName: {
    color: '#757575',
  },
  badgeLocation: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
  badgeDetails: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderLeftWidth: 6,
  },
  badgeDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeDetailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  badgeDetailIcon: {
    fontSize: 28,
  },
  badgeDetailDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    lineHeight: 20,
  },
  badgeDetailDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeDetailDateText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 6,
  },
  equipmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  equipmentIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  equipmentName: {
    fontSize: 14,
    color: '#333',
  },
  vehicleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 16,
  },
  vehicleIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyMessage: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#757575',
    padding: 8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  button: {
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    marginLeft: 8,
    elevation: 2,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#1976D2',
    flex: 1,
    marginRight: 8,
  },
  secondaryButtonText: {
    color: '#1976D2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default PassportScreen;