import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';

const AR_URL = 'https://create.overlyapp.com/webar/67ef27d899839adee9f78b6d7e7b4658c7ea72d4';
const QR_URL = 'https://api.qrserver.com/v1/create-qr-code/?data=https://create.overlyapp.com/webar/67ef27d899839adee9f78b6d7e7b4658c7ea72d4&size=200x200';

const ParisARExperience = ({ navigation, route }) => {
  const { avatar, equipment, vehicle, nextStop } = route.params || {};
  const [completed, setCompleted] = useState(false);

  const handleOpenAR = () => {
    Linking.openURL(AR_URL);
  };

  const handleComplete = () => {
    navigation.replace('Map', { avatar, equipment, vehicle, currentStop: nextStop });
  };

  return (
    <View style={styles.container}>
      {!completed ? (
        <>
          <Text style={styles.title}>Paris AR Deneyimi</Text>
          <Text style={styles.emoji}>🗼</Text>
          <Text style={styles.info}>Telefonunu Eyfel Kulesi'ne doğru tut ve keşfetmeye başla!</Text>
          <TouchableOpacity style={styles.button} onPress={handleOpenAR}>
            <Text style={styles.buttonText}>AR Deneyimini Başlat</Text>
          </TouchableOpacity>
          <Text style={styles.qrLabel}>Ya da QR kodu telefonunla tara:</Text>
          <Image source={{ uri: QR_URL }} style={styles.qr} />
          <TouchableOpacity style={styles.button} onPress={() => setCompleted(true)}>
            <Text style={styles.buttonText}>Görevi Tamamla</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Tebrikler!</Text>
          <Text style={styles.emoji}>🎖️</Text>
          <Text style={styles.info}>Eyfel Rozeti Kazandın!</Text>
          <TouchableOpacity style={styles.button} onPress={handleComplete}>
            <Text style={styles.buttonText}>Sonraki Göreve Geç</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    color: '#388E3C',
    marginBottom: 20,
    textAlign: 'center',
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
  qrLabel: {
    fontSize: 15,
    color: '#888',
    marginTop: 20,
    marginBottom: 8,
  },
  qr: {
    width: 160,
    height: 160,
    marginBottom: 10,
  },
});

export default ParisARExperience; 