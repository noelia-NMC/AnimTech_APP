import React from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Inicio de la App AnimTech</Text>
      <Text>Aquí aparecerá la información del collar.</Text>
      <Button title="Ver datos del collar" onPress={() => navigation.navigate('Collar')} />
    </View>
  );
};

export default HomeScreen;
