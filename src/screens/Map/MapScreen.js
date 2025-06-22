import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  ScrollView,
  ImageBackground,
  StatusBar,
  SafeAreaView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

const stops = [
  { 
    id: 1, 
    name: 'Paris', 
    icon: '🗼', 
    reward: 'Eyfel Rozeti', 
    type: 'ar', 
    screen: 'ParisARExperience', 
    description: 'Eyfel Kulesi ve Paris sokakları.',
    color: '#FF9800',
    bgColor: '#FFF3E0',
    progress: 0, // 0-100 arası ilerleme
  },
  { 
    id: 2, 
    name: 'Londra', 
    icon: '🎡', 
    reward: 'Big Ben Rozeti', 
    type: 'ar', 
    screen: 'LondonARExperience', 
    description: 'Big Ben ve Thames Nehri.',
    color: '#4CAF50',
    bgColor: '#E8F5E9',
    progress: 0,
  },
  { 
    id: 3, 
    name: 'Roma', 
    icon: '🏛️', 
    reward: 'Kolezyum Rozeti', 
    type: 'info', 
    screen: 'InfoCardScreen', 
    description: 'Kolezyum ve antik Roma.',
    color: '#9C27B0',
    bgColor: '#F3E5F5',
    progress: 0,
  },
  { 
    id: 4, 
    name: 'Bulutlar', 
    icon: '☁️', 
    reward: 'Bulut Boyama Rozeti', 
    type: 'game', 
    screen: 'CloudPaintGame', 
    description: 'Hayal gücünü kullan!',
    color: '#2196F3',
    bgColor: '#E3F2FD',
    progress: 0,
  },
];

// Durak tipine göre ikon seçimi
const getTypeIcon = (type) => {
  switch(type) {
    case 'ar':
      return <FontAwesome5 name="vr-cardboard" size={16} color="#FFF" />;
    case 'game':
      return <FontAwesome5 name="gamepad" size={16} color="#FFF" />;
    case 'info':
      return <FontAwesome5 name="info-circle" size={16} color="#FFF" />;
    default:
      return <FontAwesome5 name="map-marker-alt" size={16} color="#FFF" />;
  }
};

const MapScreen = ({ route, navigation }) => {
  const { avatar, equipments, vehicle } = route.params || {};
  const [selectedStop, setSelectedStop] = useState(null);
  const [scaleAnim] = useState(new Animated.Value(0.95));
  const [fadeAnim] = useState(new Animated.Value(0));
  
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
        <View style={styles.avatarBorder} />
      </View>
    );
  };
  
  // Durak kartı render fonksiyonu
  const renderStopCard = (stop, index) => {
    const delay = index * 100; // Her kart için kademeli gecikme
    
    return (
      <Animated.View 
        key={stop.id}
        style={[
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.stopCard,
            { backgroundColor: stop.bgColor }
          ]}
          activeOpacity={0.7}
          onPress={() => {
            setSelectedStop(stop);
            setTimeout(() => {
              navigation.navigate(stop.screen, { avatar, stop, equipments, vehicle });
            }, 200);
          }}
        >
          <View style={[styles.stopIconContainer, { backgroundColor: stop.color }]}>
            <Text style={styles.stopIcon}>{stop.icon}</Text>
            <View style={styles.typeIconContainer}>
              {getTypeIcon(stop.type)}
            </View>
          </View>
          
          <View style={styles.stopContent}>
            <Text style={styles.stopName}>{stop.name}</Text>
            <Text style={styles.stopDesc}>{stop.description}</Text>
            
            <View style={styles.rewardContainer}>
              <Text style={styles.rewardIcon}>🎖️</Text>
              <Text style={styles.stopReward}>{stop.reward}</Text>
            </View>
            
            {stop.progress > 0 && (
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${stop.progress}%`, backgroundColor: stop.color }]} />
              </View>
            )}
          </View>
          
          <View style={[styles.arrowContainer, { backgroundColor: stop.color }]}>
            <MaterialIcons name="arrow-forward" size={22} color="#FFF" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#E3F2FD" barStyle="dark-content" />
      <LinearGradient
        colors={['#E3F2FD', '#BBDEFB', '#90CAF9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <FontAwesome5 name="map-marked-alt" size={24} color="#1565C0" style={styles.titleIcon} />
            <Text style={styles.title}>Keşif Haritası</Text>
          </View>
          
          <View style={styles.avatarSection}>
            <View style={styles.nameContainer}>
              <Text style={styles.nameLabel}>Kaşif:</Text>
              <Text style={styles.nameValue}>{avatar?.name || 'Adsız Kaşif'}</Text>
            </View>
            {renderAvatar()}
          </View>
        </View>
        
        <Text style={styles.subtitle}>Keşfedilecek Yerler</Text>
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.stopsContainer}
          showsVerticalScrollIndicator={false}
        >
          {stops.map((stop, index) => renderStopCard(stop, index))}
          
          <View style={styles.mapFooter}>
            <Text style={styles.footerText}>Yeni yerler yakında eklenecek!</Text>
          </View>
        </ScrollView>
        
        <TouchableOpacity 
          style={styles.passportButton}
          onPress={() => navigation.navigate('Passport', { avatar })}
        >
          <FontAwesome5 name="passport" size={20} color="#FFF" />
          <Text style={styles.passportButtonText}>Kaşif Pasaportum</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT : 0,
    backgroundColor: '#E3F2FD',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(25, 118, 210, 0.2)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565C0',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameContainer: {
    marginRight: 10,
    alignItems: 'flex-end',
  },
  nameLabel: {
    fontSize: 12,
    color: '#1976D2',
  },
  nameValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  avatarContainer: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  avatarBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: width * 0.06,
    borderWidth: 2,
    borderColor: '#1976D2',
  },
  avatarViewer: {
    flex: 1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 5,
  },
  scrollView: {
    flex: 1,
  },
  stopsContainer: {
    padding: 15,
    paddingBottom: 80, // Pasaport butonu için yer bırak
  },
  stopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  stopIconContainer: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  stopIcon: {
    fontSize: 32,
  },
  typeIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopContent: {
    flex: 1,
    padding: 12,
  },
  stopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 4,
  },
  stopDesc: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  stopReward: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '500',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 8,
    width: '100%',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 12,
  },
  mapFooter: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#1976D2',
    fontStyle: 'italic',
  },
  passportButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  passportButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default MapScreen;