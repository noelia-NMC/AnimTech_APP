import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebaseConfig';


const CollarScreen = () => {
  const [temperatura, setTemperatura] = useState(null);
  const [pulso, setPulso] = useState(null);
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    const collarRef = ref(db, 'collares/collar_001');

    const unsubscribe = onValue(collarRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTemperatura(data.temperatura);
        setPulso(data.pulso);
        setTimestamp(data.timestamp);
      }
    });

    return () => unsubscribe(); // Limpia el listener al salir
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Datos del Collar 🐾</Text>
      <Text>🌡️ Temperatura: {temperatura ?? '---'} °C</Text>
      <Text>💓 Pulso: {pulso ?? '---'} bpm</Text>
      <Text>🕒 Última lectura: {timestamp ?? '---'}</Text>
    </View>
  );
};

export default CollarScreen;
