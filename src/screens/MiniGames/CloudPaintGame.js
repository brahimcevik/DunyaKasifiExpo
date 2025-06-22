import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const cloudColors = ['#fff', '#90caf9', '#f8bbd0', '#ffe082', '#a5d6a7'];

const CloudPaintGame = ({ navigation, route }) => {
  const { avatar, equipment, vehicle, nextStop } = route.params || {};
  const [cloudColor, setCloudColor] = useState('#fff');
  const [completed, setCompleted] = useState(false);

  const handlePaint = (color) => setCloudColor(color);

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
          <Text style={styles.title}>Bulut Boyama</Text>
          <Text style={styles.info}>Hayalindeki bulutu renklendir!</Text>
          <View style={[styles.cloud, { backgroundColor: cloudColor }]}> 
            <Text style={styles.cloudEmoji}>☁️</Text>
          </View>
          <View style={styles.palette}>
            {cloudColors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[styles.colorDot, { backgroundColor: color, borderWidth: cloudColor === color ? 3 : 1 }]}
                onPress={() => handlePaint(color)}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={() => setCompleted(true)}>
            <Text style={styles.buttonText}>Görevi Tamamla</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Tebrikler!</Text>
          <Text style={styles.emoji}>🎨</Text>
          <Text style={styles.info}>Bulutunu başarıyla boyadın!</Text>
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
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    color: '#388E3C',
    marginBottom: 20,
    textAlign: 'center',
  },
  cloud: {
    width: 120,
    height: 80,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#90caf9',
  },
  cloudEmoji: {
    fontSize: 48,
  },
  palette: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 8,
    borderColor: '#1976D2',
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
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
});

export default CloudPaintGame; 