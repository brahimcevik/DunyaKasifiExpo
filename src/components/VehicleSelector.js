import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const vehicleOptions = [
  {
    id: 'magic_carpet',
    name: 'Sihirli Halı',
    icon: '🪄',
  },
  {
    id: 'airplane',
    name: 'Küçük Uçak',
    icon: '✈️',
  },
  {
    id: 'rocket',
    name: 'Roket',
    icon: '🚀',
  },
  {
    id: 'hot_air_balloon',
    name: 'Sıcak Hava Balonu',
    icon: '🎈',
  },
];

const VehicleSelector = ({ selectedVehicle, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Keşif Aracını Seç</Text>
      <View style={styles.vehicleGrid}>
        {vehicleOptions.map((vehicle) => (
          <TouchableOpacity
            key={vehicle.id}
            style={[
              styles.vehicleItem,
              selectedVehicle === vehicle.id && styles.selectedItem,
            ]}
            onPress={() => onSelect(vehicle.id)}
          >
            <Text style={styles.icon}>{vehicle.icon}</Text>
            <Text style={styles.vehicleName}>{vehicle.name}</Text>
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
  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vehicleItem: {
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
  vehicleName: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default VehicleSelector; 