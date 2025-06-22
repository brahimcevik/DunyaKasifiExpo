import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const AvatarScreen = ({ navigation }) => {
  const [avatar, setAvatar] = useState({
    name: '',
    avatarUrl: null,
  });

  // Debug için state değişikliklerini izle
  useEffect(() => {
    console.log('Avatar state changed:', {
      name: avatar.name,
      avatarUrl: avatar.avatarUrl,
      canContinue: !!(avatar.name.trim() && avatar.avatarUrl)
    });
  }, [avatar]);

  // WebView'a enjekte edilecek JavaScript kodunu güncelle
  const injectedJavaScript = `
    function handleAvatarSelection(url) {
      if (url && url.includes('models.readyplayer.me')) {
        console.log('Selected avatar URL:', url);
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'avatar-selected',
          url: url
        }));
      }
    }

    function initializeAvatarHandlers() {
      // Tüm avatar kartlarını seç
      const avatarCards = document.querySelectorAll('.avatar-card, .avatar-card-selected, [data-testid="avatar-card"], .avatar-item, .saved-avatar, [data-testid="saved-avatar"]');
      
      avatarCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // Avatar URL'sini farklı kaynaklardan bulmaya çalış
          let avatarUrl = 
            card.getAttribute('data-url') || 
            card.getAttribute('href') ||
            card.querySelector('a')?.href ||
            card.closest('a')?.href ||
            card.querySelector('img')?.getAttribute('data-model-url') ||
            card.querySelector('img')?.src?.replace('/image', '/model') ||
            card.getAttribute('data-model-url') ||
            card.querySelector('[data-model-url]')?.getAttribute('data-model-url') ||
            card.getAttribute('data-avatar-url') ||
            card.querySelector('[data-avatar-url]')?.getAttribute('data-avatar-url');
          
          if (avatarUrl) {
            handleAvatarSelection(avatarUrl);
          }
        });
      });

      // Tüm avatar linklerini seç
      document.querySelectorAll('a[href*="models.readyplayer.me"]').forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          handleAvatarSelection(link.href);
        });
      });

      // Ready Player Me event'lerini dinle
      window.addEventListener('message', function(event) {
        try {
          const data = event.data;
          if (typeof data === 'string') {
            const parsedData = JSON.parse(data);
            if (parsedData.type === 'vps.ready') {
              console.log('VPS Ready');
            } else if (parsedData.type === 'avatar-selected') {
              handleAvatarSelection(parsedData.url);
            }
          }
        } catch (e) {
          console.log('Message parsing error:', e);
        }
      });

      // Kaydedilmiş avatarlar için özel event listener
      document.addEventListener('click', function(event) {
        const savedAvatar = event.target.closest('.saved-avatar, [data-testid="saved-avatar"]');
        if (savedAvatar) {
          event.preventDefault();
          event.stopPropagation();
          
          const modelUrl = 
            savedAvatar.getAttribute('data-model-url') ||
            savedAvatar.getAttribute('data-avatar-url') ||
            savedAvatar.querySelector('[data-model-url]')?.getAttribute('data-model-url') ||
            savedAvatar.querySelector('[data-avatar-url]')?.getAttribute('data-avatar-url');
          
          if (modelUrl) {
            handleAvatarSelection(modelUrl);
          }
        }
      }, true);
    }

    // Sayfa yüklendiğinde başlat
    window.addEventListener('load', initializeAvatarHandlers);
    
    // DOM değişikliklerini izle
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          initializeAvatarHandlers();
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Genel click event listener
    document.addEventListener('click', function(event) {
      const target = event.target.closest('[data-model-url], [data-avatar-url], a[href*="models.readyplayer.me"], .avatar-card, .avatar-card-selected, .avatar-item, .saved-avatar');
      if (target) {
        event.preventDefault();
        const modelUrl = 
          target.getAttribute('data-model-url') || 
          target.getAttribute('data-avatar-url') ||
          target.href ||
          target.querySelector('[data-model-url]')?.getAttribute('data-model-url') ||
          target.querySelector('[data-avatar-url]')?.getAttribute('data-avatar-url');
        
        if (modelUrl) {
          handleAvatarSelection(modelUrl);
        }
      }
    }, true);

    // Ready Player Me'nin kendi event'lerini dinle
    window.addEventListener('message', function(event) {
      try {
        const data = event.data;
        if (typeof data === 'string' && data.includes('models.readyplayer.me')) {
          handleAvatarSelection(data);
        }
      } catch (e) {
        console.log('Message parsing error:', e);
      }
    });

    // Ready Player Me'nin avatar seçim event'ini dinle
    window.addEventListener('message', function(event) {
      try {
        const data = event.data;
        if (typeof data === 'string') {
          const parsedData = JSON.parse(data);
          if (parsedData.type === 'avatar-selected' || parsedData.type === 'avatar-created') {
            handleAvatarSelection(parsedData.url);
          }
        }
      } catch (e) {
        console.log('Message parsing error:', e);
      }
    });
  `;

  const handleAvatarMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log("Parsed message data:", data);

      let avatarUrl = null;

      if (data.type === 'avatar-selected' && data.url) {
        avatarUrl = data.url;
      } else if (data.type === 'rpm-message') {
        avatarUrl = data.data?.url || data.data;
      } else if (typeof data === 'string' && data.includes('models.readyplayer.me')) {
        avatarUrl = data;
      } else if (data.url) {
        avatarUrl = data.url;
      }

      if (avatarUrl) {
        // URL'yi temizle
        avatarUrl = avatarUrl.toString()
          .replace(/\\"/g, '')
          .replace(/"/g, '')
          .trim();

        if (avatarUrl.includes('models.readyplayer.me')) {
          console.log("Setting avatar URL:", avatarUrl);
          setAvatar(prev => ({
            ...prev,
            avatarUrl: avatarUrl
          }));
          Alert.alert("Avatar Seçildi", "Avatarın başarıyla kaydedildi!");
        }
      }
    } catch (e) {
      // String mesaj gelmiş olabilir
      const messageData = event.nativeEvent.data;
      if (typeof messageData === 'string' && messageData.includes('models.readyplayer.me')) {
        const cleanUrl = messageData.replace(/\\"/g, '').replace(/"/g, '').trim();
        console.log("Setting avatar URL from string:", cleanUrl);
        setAvatar(prev => ({
          ...prev,
          avatarUrl: cleanUrl
        }));
        Alert.alert("Avatar Seçildi", "Avatarın başarıyla kaydedildi!");
      } else {
        console.log("Message parsing error:", e.message);
      }
    }
  };

  const handleContinue = () => {
    console.log("Continue button pressed with state:", avatar);
    if (avatar.name.trim() && avatar.avatarUrl) {
      navigation.navigate('Equipment', { avatar });
    } else {
      Alert.alert(
        "Uyarı",
        "Devam etmek için kaşifine bir isim ver ve avatarını oluştur!"
      );
    }
  };

  // canContinue kontrolünü güncelle
  const canContinue = Boolean(avatar.name.trim() && avatar.avatarUrl);

  return (
    <LinearGradient
      colors={['#E3F2FD', '#BBDEFB']}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.emoji}>🌟</Text>
          <Text style={styles.title}>Süper Kaşifini Oluştur</Text>
          <Text style={styles.emoji}>🌟</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Kaşifinin İsmi:</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="İsmini buraya yaz..."
            placeholderTextColor="#90CAF9"
            value={avatar.name}
            onChangeText={name => {
              console.log("Name changed to:", name);
              setAvatar(prev => ({ ...prev, name }));
            }}
          />
          {avatar.name.trim() ? (
            <View style={styles.nameValidIcon}>
              <Text style={styles.nameValidText}>✓</Text>
            </View>
          ) : null}
        </View>
        
        <Text style={styles.avatarInstructions}>
          Şimdi avatarını seç ve maceraya hazırlan!
        </Text>
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.avatarHeader}>
          <Text style={styles.avatarHeaderText}>
            {avatar.avatarUrl ? '✅ Harika! Avatarın Hazır!' : '👇 Avatarını Seç'}
          </Text>
        </View>
        
        <WebView
          source={{ uri: 'https://demo.readyplayer.me/avatar' }}
          style={styles.webview}
          onMessage={handleAvatarMessage}
          injectedJavaScript={injectedJavaScript}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error:', nativeEvent);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView HTTP error:', nativeEvent);
          }}
        />
        
        <View style={styles.avatarFooter}>
          <Text style={styles.avatarFooterText}>
            {avatar.avatarUrl ? 'Avatarın seçildi! Devam edebilirsin.' : 'Avatarını seçmek için yukarıdaki seçeneklere tıkla.'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          !canContinue && styles.disabledButton
        ]}
        onPress={handleContinue}
        disabled={!canContinue}
      >
        <Text style={styles.continueButtonText}>
          {canContinue ? 'Maceraya Başla! 🚀' : 'Önce Kaşifini Tamamla'}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1565C0',
    marginHorizontal: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  emoji: {
    fontSize: 24,
  },
  inputContainer: {
    width: '90%',
    position: 'relative',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
    marginLeft: 5,
  },
  nameInput: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    fontSize: 18,
    borderWidth: 2,
    borderColor: '#1976D2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  nameValidIcon: {
    position: 'absolute',
    right: 15,
    top: 45,
    backgroundColor: '#4CAF50',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameValidText: {
    color: 'white',
    fontWeight: 'bold',
  },
  avatarInstructions: {
    fontSize: 16,
    color: '#1976D2',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '500',
  },
  avatarContainer: {
    width: width * 0.9,
    height: height * 0.55,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  avatarHeader: {
    backgroundColor: '#2196F3',
    padding: 10,
    alignItems: 'center',
  },
  avatarHeaderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  avatarFooter: {
    backgroundColor: '#E3F2FD',
    padding: 8,
    alignItems: 'center',
  },
  avatarFooterText: {
    color: '#1565C0',
    fontSize: 14,
  },
  continueButton: {
    backgroundColor: '#1976D2',
    padding: 18,
    margin: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#0D47A1',
  },
  disabledButton: {
    backgroundColor: '#90CAF9',
    borderColor: '#64B5F6',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default AvatarScreen;