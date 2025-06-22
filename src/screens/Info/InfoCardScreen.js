import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const InfoCardScreen = ({ navigation, route }) => {
  const { avatar, equipment, vehicle, nextStop } = route.params || {};
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    if (nextStop !== null && typeof nextStop === 'number') {
      navigation.replace('Map', { avatar, equipment, vehicle, currentStop: nextStop });
    } else {
      navigation.replace('Passport', { avatar, equipment, vehicle });
    }
  };

  return (
    <View style={styles.container}>
      {!completed ? (
        <>
          <Text style={styles.title}>Kolezyum Bilgi Kartı</Text>
          <Text style={styles.emoji}>🏛️</Text>
          <Text style={styles.info}>
            Kolezyum, Roma'da bulunan ve antik Roma döneminden kalma en büyük amfitiyatrodur. Gladyatör dövüşleriyle ünlüdür!
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => setCompleted(true)}>
            <Text style={styles.buttonText}>Görevi Tamamla</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Tebrikler!</Text>
          <Text style={styles.emoji}>🎖️</Text>
          <Text style={styles.info}>Kolezyum Rozeti Kazandın!</Text>
          <TouchableOpacity style={styles.button} onPress={handleComplete}>
            <Text style={styles.buttonText}>{nextStop !== null && typeof nextStop === 'number' ? 'Sonraki Göreve Geç' : 'Pasaporta Geç'}</Text>
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
    marginBottom: 30,
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
});

export default InfoCardScreen; 