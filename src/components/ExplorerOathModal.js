import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

const ExplorerOathModal = ({ visible, onClose, avatar, equipment, vehicle }) => {
  const [showCertificate, setShowCertificate] = React.useState(false);

  const handleOathComplete = () => {
    setShowCertificate(true);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {!showCertificate ? (
          <View style={styles.oathContainer}>
            <Text style={styles.oathEmoji}>🤝🌍</Text>
            <Text style={styles.oathText}>
              "Dünya Kaşifi olarak keşfetmeye, öğrenmeye ve paylaşmaya söz veriyorum!"
            </Text>
            <TouchableOpacity
              style={styles.oathButton}
              onPress={handleOathComplete}
            >
              <Text style={styles.buttonText}>Yemini Et</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.certificateContainer}>
            <Text style={styles.certificateTitle}>Dünya Kaşifi Sertifikası 🎓</Text>
            <View style={styles.avatarPreview}>
              <Text style={{ fontSize: 40 }}>🧒</Text>
            </View>
            <Text style={styles.certificateText}>
              {avatar.name || 'Kaşif'} adlı kaşifimiz, seçtiği {equipment || 'ekipman'} ve {vehicle || 'araç'} ile dünyayı keşfetmeye hazır!
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Tamam</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  oathContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  oathEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  oathText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
    color: '#4CAF50',
  },
  oathButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  certificateContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  certificateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  avatarPreview: {
    width: 100,
    height: 100,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  certificateText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExplorerOathModal; 