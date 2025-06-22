import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ExplorerAcademyHeader = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🧭🌍</Text>
      <Text style={styles.title}>Kaşif Akademisi</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
  },
});

export default ExplorerAcademyHeader; 