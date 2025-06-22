import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

export default function OathModal({ visible, onAccept, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Kaşif Yemini</Text>
          <Text style={styles.text}>
            "Dünya Kaşifi olarak keşfetmeye, öğrenmeye ve paylaşmaya söz veriyorum!"
          </Text>
          <Button title="Söz Veriyorum!" onPress={onAccept} />
          <Button title="Vazgeç" onPress={onClose} color="#888" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  box: { backgroundColor: '#fff', padding: 30, borderRadius: 20, alignItems: 'center', width: 300 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
}); 