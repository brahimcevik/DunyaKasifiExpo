import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const options = [
  { id: 'paris', name: 'Paris', icon: '🗼' },
  { id: 'london', name: 'Londra', icon: '🎡' },
  { id: 'rome', name: 'Roma', icon: '🏛️' },
];

const MapDetectiveGame = ({ navigation, route }) => {
  const { avatar, equipment, vehicle, nextStop } = route.params || {};
  const [selected, setSelected] = useState(null);
  const [success, setSuccess] = useState(false);

  const correctId = 'london';

  const handleSelect = (id) => {
    setSelected(id);
    if (id === correctId) setSuccess(true);
  };

  const handleComplete = () => {
    navigation.replace('Map', { avatar, equipment, vehicle, currentStop: nextStop });
  };

  return (
    <View style={styles.container}>
      {!success ? (
        <>
          <Text style={styles.title}>Harita Dedektifi</Text>
          <Text style={styles.info}>Big Ben'in bulunduğu şehri bul!</Text>
          <View style={styles.optionsRow}>
            {options.map(opt => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.option, selected === opt.id && styles.selected]}
                onPress={() => handleSelect(opt.id)}
              >
                <Text style={styles.icon}>{opt.icon}</Text>
                <Text style={styles.name}>{opt.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>Tebrikler!</Text>
          <Text style={styles.emoji}>🎖️</Text>
          <Text style={styles.info}>Big Ben Rozeti Kazandın!</Text>
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
  info: {
    fontSize: 18,
    color: '#388E3C',
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  option: {
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    width: 90,
  },
  selected: {
    borderColor: '#1976D2',
    backgroundColor: '#E3F2FD',
  },
  icon: {
    fontSize: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    textAlign: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
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

export default MapDetectiveGame; 