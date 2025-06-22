import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const InfoScreen = ({ route, navigation }) => {
  const { location, avatar } = route.params;

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
          <Text style={styles.title}>{location.title}</Text>
          {renderAvatar()}
        </View>

        <View style={styles.content}>
          <View style={styles.infoCard}>
            <MaterialIcons name="info" size={24} color="#1976D2" />
            <Text style={styles.infoTitle}>Hakkında</Text>
            <Text style={styles.infoText}>{location.description}</Text>
          </View>

          <View style={styles.infoCard}>
            <MaterialIcons name="history" size={24} color="#1976D2" />
            <Text style={styles.infoTitle}>Tarihçe</Text>
            <Text style={styles.infoText}>
              {location.type === 'historical'
                ? 'Bu tarihi yapı, yüzyıllar boyunca önemli olaylara tanıklık etmiş ve günümüze kadar ayakta kalmayı başarmıştır.'
                : 'Bu yapı, şehrin önemli simgelerinden biri olarak kültürel mirasımızı yansıtmaktadır.'}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <MaterialIcons name="architecture" size={24} color="#1976D2" />
            <Text style={styles.infoTitle}>Mimari</Text>
            <Text style={styles.infoText}>
              {location.type === 'historical'
                ? 'Dönemin mimari özelliklerini yansıtan bu yapı, ustalıkla işlenmiş detaylarıyla dikkat çekmektedir.'
                : 'Modern ve klasik mimari öğelerin harmanlandığı bu yapı, şehrin silüetini tamamlayan önemli bir parçadır.'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.arButton}
            onPress={() => {
              navigation.navigate('AR', {
                location,
                avatar,
              });
            }}
          >
            <MaterialIcons name="view-in-ar" size={24} color="white" />
            <Text style={styles.arButtonText}>AR ile Keşfet</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976D2',
    flex: 1,
  },
  avatarContainer: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    elevation: 5,
  },
  avatarViewer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
    marginTop: 10,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  arButton: {
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  arButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default InfoScreen; 