import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { getActiveAlerts, markAlertAsSeen } from '../services/colarService';
import styled from 'styled-components/native';

// Estilos para la pantalla de alertas
const Container = styled.View`
  flex: 1;
  background-color: #f9f9f9;
`;

const Header = styled.View`
  background-color: #e74c3c;
  padding: 20px;
  align-items: center;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: white;
  margin-bottom: 5px;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
`;

const AlertCard = styled.View`
  background-color: white;
  margin: 10px 15px;
  border-radius: 12px;
  padding: 15px;
  elevation: 3;
  border-left-width: 4px;
  border-left-color: #e74c3c;
`;

const AlertMessage = styled.Text`
  font-size: 16px;
  color: #333;
  font-weight: bold;
  margin-bottom: 10px;
`;

const AlertDetail = styled.Text`
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
`;

const AlertTimestamp = styled.Text`
  font-size: 12px;
  color: #888;
  margin-top: 5px;
`;

const ActionButton = styled.TouchableOpacity`
  background-color: ${props => props.secondary ? '#95a5a6' : '#3498db'};
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  margin-top: 10px;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 14px;
`;

const NoAlertsContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const NoAlertsText = styled.Text`
  font-size: 16px;
  color: #555;
  text-align: center;
  margin-top: 10px;
`;

const NoAlertsIcon = styled.Text`
  font-size: 50px;
  margin-bottom: 10px;
`;

const CollarAlertsScreen = ({ navigation }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    setLoading(true);
    const activeAlerts = await getActiveAlerts();
    setAlerts(activeAlerts);
    setLoading(false);
  };

  useEffect(() => {
    loadAlerts();
    
    // También podríamos configurar una actualización periódica
    const interval = setInterval(loadAlerts, 60000); // Actualizar cada minuto
    
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsSeen = async (alertId) => {
    try {
      await markAlertAsSeen(alertId);
      // Actualizar la lista local
      setAlerts(alerts.filter(alert => alert.id !== alertId));
      Alert.alert('Alerta resuelta', 'La alerta ha sido marcada como atendida.');
    } catch (error) {
      console.error('Error al marcar alerta como vista:', error);
      Alert.alert('Error', 'No se pudo resolver la alerta. Inténtalo de nuevo.');
    }
  };

  const handleRefresh = async () => {
    await loadAlerts();
  };

  const renderAlertItem = ({ item }) => (
    <AlertCard>
      <AlertMessage>{item.mensaje}</AlertMessage>
      <AlertDetail>🌡️ Temperatura: {item.temperatura}°C</AlertDetail>
      <AlertDetail>💓 Ritmo cardíaco: {item.pulso} bpm</AlertDetail>
      <AlertTimestamp>Detectado: {item.timestamp}</AlertTimestamp>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <ActionButton 
          style={{ flex: 1, marginRight: 5 }}
          onPress={() => handleMarkAsSeen(item.id)}
        >
          <ButtonText>Marcar como atendida</ButtonText>
        </ActionButton>
        
        <ActionButton 
          secondary
          style={{ flex: 1, marginLeft: 5 }}
          onPress={() => navigation.navigate('CollarScreen')}
        >
          <ButtonText>Ver detalles</ButtonText>
        </ActionButton>
      </View>
    </AlertCard>
  );

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>Alertas del Collar</Title>
          <Subtitle>Monitoreo de signos vitales</Subtitle>
        </Header>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={{ marginTop: 10, color: '#555' }}>Cargando alertas...</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Alertas del Collar</Title>
        <Subtitle>Monitoreo de signos vitales</Subtitle>
      </Header>

      {alerts.length > 0 ? (
        <FlatList
          data={alerts}
          renderItem={renderAlertItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 5 }}
          refreshing={loading}
          onRefresh={handleRefresh}
        />
      ) : (
        <NoAlertsContainer>
          <NoAlertsIcon>🐶</NoAlertsIcon>
          <NoAlertsText>¡No hay alertas activas!</NoAlertsText>
          <NoAlertsText>Tu mascota parece estar en buen estado de salud.</NoAlertsText>
          <ActionButton 
            style={{ width: '80%', marginTop: 20 }}
            onPress={handleRefresh}
          >
            <ButtonText>Actualizar</ButtonText>
          </ActionButton>
        </NoAlertsContainer>
      )}
    </Container>
  );
};

export default CollarAlertsScreen;