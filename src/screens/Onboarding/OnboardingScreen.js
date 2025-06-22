import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const OnboardingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🌍🧭🎈</Text>
      <Text style={styles.title}>Kaşif Akademisi'ne Hoş Geldin!</Text>
      <Text style={styles.subtitle}>Dünyayı keşfetmeye hazır mısın?</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Avatar')}>
        <Text style={styles.buttonText}>Başla</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#388E3C',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1976D2',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen; 