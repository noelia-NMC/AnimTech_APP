import YoRescatoScreen from '../screens/YoRescatoScreen';
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import ComunidadScreen from '../screens/ComunidadScreen';
import RescatesActivosScreen from '../screens/RescatesActivosScreen';

const Drawer = createDrawerNavigator();

const MainDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#42a8a1',
          width: 240,
        },
        drawerLabelStyle: {
          color: '#ffffff',
          fontSize: 16,
        },
      }}
    >
      <Drawer.Screen name="Inicio" component={HomeScreen} />
      <Drawer.Screen name="Yo Rescato" component={YoRescatoScreen} />
      <Drawer.Screen name="Ver Rescates" component={RescatesActivosScreen} />
      <Drawer.Screen name="Comunidad" component={ComunidadScreen} />
    </Drawer.Navigator>
  );
};

export default MainDrawer;

