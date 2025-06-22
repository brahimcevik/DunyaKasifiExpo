import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const equipmentOptions = [
  {
    id: 'binoculars',
    name: 'Sanal Dürbün',
    icon: '🔭',
  },
  {
    id: 'compass',
    name: 'Sihirli Pusula',
    icon: '🧭',
  },
  {
    id: 'notebook',
    name: 'Not Defteri',
    icon: '📒',
  },
  {
    id: 'camera',
    name: 'Fotoğraf Makinesi',
    icon: '📷',
  },
];

const EquipmentSelector = ({ selectedEquipment, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Keşif Ekipmanlarını Seç</Text>
      <View style={styles.equipmentGrid}>
        {equipmentOptions.map((equipment) => (
          <TouchableOpacity
            key={equipment.id}
            style={[
              styles.equipmentItem,
              selectedEquipment === equipment.id && styles.selectedItem,
            ]}
            onPress={() => onSelect(equipment.id)}
          >
            <Text style={styles.icon}>{equipment.icon}</Text>
            <Text style={styles.equipmentName}>{equipment.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#4CAF50',
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  equipmentItem: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedItem: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  icon: {
    fontSize: 40,
    marginBottom: 10,
  },
  equipmentName: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default EquipmentSelector; 