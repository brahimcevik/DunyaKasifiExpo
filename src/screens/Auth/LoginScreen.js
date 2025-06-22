import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dünya Kaşifi'ne Hoş Geldin!</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Avatar')}
      >
        <Text style={styles.buttonText}>Kaşif Ol</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40, color: '#4CAF50' },
  button: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default LoginScreen;