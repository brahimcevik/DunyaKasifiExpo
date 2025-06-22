import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

const SummaryScreen = ({ navigation, route }) => {
  const avatar = route.params?.avatar;
  const [webViewError, setWebViewError] = useState(null);
  const [webViewLoaded, setWebViewLoaded] = useState(false);

  // Ekipman ekranındakiyle aynı şekilde URL'yi temizle
  const cleanAvatarUrl = avatar?.avatarUrl ? avatar.avatarUrl.replace(/\\/g, '').replace(/"/g, '') : '';

  // Ekipman ekranındakiyle aynı viewerHTML
  const viewerHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
        <style>
          body { margin: 0; padding: 0; overflow: hidden; width: 100vw; height: 100vh; background: transparent; }
          model-viewer { width: 100%; height: 100%; --poster-color: transparent; background-color: transparent; }
        </style>
      </head>
      <body>
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
          const viewer = document.querySelector('model-viewer');
          viewer.addEventListener('error', (error) => {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: error.detail }));
          });
          viewer.addEventListener('load', () => {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'loaded' }));
          });
        </script>
      </body>
    </html>
  `;

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'error') {
        setWebViewError(data.message || 'Model yüklenemedi.');
      }
      if (data.type === 'loaded') {
        setWebViewLoaded(true);
      }
    } catch (e) {
      setWebViewError('Model yüklenemedi.');
    }
  };

  return (
    <LinearGradient colors={['#E3F2FD', '#BBDEFB']} style={styles.container}>
      <Text style={styles.title}>Seyahat Günlüğü</Text>
      <View style={styles.avatarContainer}>
        {webViewError ? (
          <Text style={styles.errorText}>Avatar yüklenemedi: {webViewError}</Text>
        ) : (
          <WebView
            key={cleanAvatarUrl}
            source={{ html: viewerHTML }}
            style={styles.webview}
            scrollEnabled={false}
            onError={e => setWebViewError('WebView hata: ' + e.nativeEvent.description)}
            onLoadEnd={() => setWebViewLoaded(true)}
            onMessage={handleWebViewMessage}
          />
        )}
      </View>
      <Text style={styles.emoji}>📖</Text>
      <Text style={styles.info}>
        Tebrikler! Tüm görevleri başarıyla tamamladın. Yeni ülkeler, kültürler ve yapılar öğrendin!
      </Text>
      <Text style={styles.summary}>
        • Paris: Eyfel Kulesi'ni AR ile keşfettin.{"\n"}
        • Londra: Big Ben'i buldun.{"\n"}
        • Roma: Kolezyum hakkında bilgi öğrendin.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Onboarding')}>
        <Text style={styles.buttonText}>Yeniden Başla</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 10,
  },
  avatarContainer: {
    width: width * 0.5,
    height: width * 0.5,
    backgroundColor: '#FFF',
    borderRadius: width * 0.25,
    overflow: 'hidden',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webview: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    color: '#388E3C',
    marginBottom: 20,
    textAlign: 'center',
  },
  summary: {
    fontSize: 16,
    color: '#333',
    marginBottom: 30,
    textAlign: 'left',
  },
  button: {
    backgroundColor: '#1976D2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SummaryScreen; 