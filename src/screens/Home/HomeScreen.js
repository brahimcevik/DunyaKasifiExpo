import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation, route }) => {
  const [avatar, setAvatar] = useState(route.params?.avatar || null);

  const menuItems = [
    {
      title: 'Harita',
      icon: 'map',
      screen: 'Map',
      color: '#4CAF50',
    },
    {
      title: 'Ekipmanlar',
      icon: 'backpack',
      screen: 'Equipment',
      color: '#2196F3',
    },
    {
      title: 'Araçlar',
      icon: 'directions-car',
      screen: 'Vehicle',
      color: '#FF9800',
    },
    {
      title: 'Mini Oyunlar',
      icon: 'sports-esports',
      screen: 'MiniGames',
      color: '#9C27B0',
    },
    {
      title: 'İlerleme',
      icon: 'trending-up',
      screen: 'Progress',
      color: '#E91E63',
    },
    {
      title: 'AR Deneyimi',
      icon: 'view-in-ar',
      screen: 'AR',
      color: '#00BCD4',
    },
  ];

  const renderAvatar = () => {
    if (!avatar?.avatarUrl) return null;

    return (
      <View style={styles.avatarContainer}>
        <WebView
          source={{ uri: 'https://viewer.readyplayer.me/avatar' }}
          style={styles.avatarViewer}
          injectedJavaScript={`
            window.addEventListener('message', function(event) {
              if (event.data.type === 'vps.ready') {
                window.postMessage(JSON.stringify({
                  type: 'load-avatar',
                  url: '${avatar.avatarUrl}'
                }));
              }
            });
          `}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'vps.ready') {
                // Avatar viewer hazır
              }
            } catch (e) {
              console.log('Message parsing error:', e);
            }
          }}
        />
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#E3F2FD', '#BBDEFB']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            Hoş Geldin, {avatar?.name || 'Kaşif'}!
          </Text>
          {renderAvatar()}
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { backgroundColor: item.color }]}
              onPress={() => navigation.navigate(item.screen, { avatar })}
            >
              <MaterialIcons name={item.icon} size={32} color="white" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 20,
  },
  avatarContainer: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    elevation: 5,
    marginBottom: 20,
  },
  avatarViewer: {
    flex: 1,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  menuItem: {
    width: width * 0.45,
    height: width * 0.45,
    margin: 5,
    borderRadius: 15,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  menuItemText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default HomeScreen; 