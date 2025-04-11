import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, Slider } from 'react-native';
import styled from 'styled-components/native';
import collarService from '../services/colarService';

const SimulatorContainer = styled.View`
  background-color: white;
  margin: 15px;
  border-radius: 12px;
  padding: 15px;
  elevation: 3;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const Description = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const Label = styled.Text`
  font-size: 14px;
  color: #555;
  flex: 1;
`;

const Value = styled.Text`
  font-size: 14px;
  color: #333;
  font-weight: bold;
  width: 60px;
  text-align: right;
`;

const Button = styled.TouchableOpacity`
  background-color: #3498db;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
  font-size: 14px;
`;

const StatusText = styled.Text`
  font-size: 12px;
  color: ${props => props.success ? '#27ae60' : '#e74c3c'};
  font-style: italic;
  margin-top: 10px;
  text-align: center;
`;

const CollarSimulator = () => {
  const [autoMode, setAutoMode] = useState(false);
  const [temperature, setTemperature] = useState(38.5);
  const [pulse, setPulse] = useState(80);
  const [status, setStatus] = useState(null);
  
  useEffect(() => {
    let interval;
    
    if (autoMode) {
      // Ejecutar una vez inmediatamente
      simulateData();
      
      // Luego programar cada 30 segundos
      interval = setInterval(simulateData, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoMode, temperature, pulse]);
  
  const simulateData = async () => {
    try {
      setStatus('Enviando datos simulados...');
      
      if (autoMode) {
        // Si está en modo automático, usar el servicio que genera valores aleatorios
        const result = await collarService.simulateCollarData();
        if (result) {
          setStatus(`✅ Datos enviados: ${result.temperatura}°C, ${result.pulso} bpm ${result.generatedAlert ? '⚠️ ¡Generó alerta!' : ''}`);
        } else {
          setStatus('❌ Error al enviar datos');
        }
      } else {
        // Si está en modo manual, usar los valores de los sliders
        const collarRef = ref(db, 'collares/collar_001');
        const timestamp = new Date().toLocaleString();
        
        // Guardar en Firebase
        await set(collarRef, {
          temperatura: Number(temperature),
          pulso: Number(pulse),
          timestamp
        });
        
        // También guardar en el historial
        await collarService.saveReading(Number(temperature), Number(pulse));
        
        // Verificar si se debe crear una alerta
        const vitalSigns = collarService.checkVitalSigns(temperature, pulse);
        if (vitalSigns.requiresAttention && (vitalSigns.temperature.status === 'danger' || vitalSigns.pulse.status === 'danger')) {
          const alertMessage = `${vitalSigns.temperature.status !== 'normal' ? vitalSigns.temperature.message : ''}${vitalSigns.temperature.status !== 'normal' && vitalSigns.pulse.status !== 'normal' ? ' y ' : ''}${vitalSigns.pulse.status !== 'normal' ? vitalSigns.pulse.message : ''}`;
          
          await collarService.createAlert(temperature, pulse, alertMessage);
          setStatus(`✅ Datos enviados: ${temperature}°C, ${pulse} bpm ⚠️ ¡Generó alerta!`);
        } else {
          setStatus(`✅ Datos enviados: ${temperature}°C, ${pulse} bpm`);
        }
      }
      
      // Borrar mensaje después de 3 segundos si no está en modo automático
      if (!autoMode) {
        setTimeout(() => setStatus(null), 3000);
      }
    } catch (error) {
      console.error('Error en simulación:', error);
      setStatus('❌ Error al enviar datos');
      
      if (!autoMode) {
        setTimeout(() => setStatus(null), 3000);
      }
    }
  };
  
  return (
    <SimulatorContainer>
      <Title>Simulador de Collar</Title>
      <Description>
        Usa este simulador para generar datos de prueba mientras conectas con tu hardware Arduino.
      </Description>
      
      <Row>
        <Label>Modo automático</Label>
        <Switch
          value={autoMode}
          onValueChange={setAutoMode}
          trackColor={{ false: '#ccc', true: '#81b0ff' }}
          thumbColor={autoMode ? '#3498db' : '#f4f3f4'}
        />
      </Row>
      
      {!autoMode && (
        <>
          <Row>
            <Label>Temperatura (°C)</Label>
            <Slider
              style={{ flex: 1, height: 40 }}
              minimumValue={36}
              maximumValue={42}
              step={0.1}
              value={temperature}
              onValueChange={setTemperature}
              minimumTrackTintColor="#3498db"
              maximumTrackTintColor="#ddd"
            />
            <Value>{temperature.toFixed(1)}</Value>
          </Row>
          
          <Row>
            <Label>Pulso (bpm)</Label>
            <Slider
              style={{ flex: 1, height: 40 }}
              minimumValue={40}
              maximumValue={200}
              step={1}
              value={pulse}
              onValueChange={setPulse}
              minimumTrackTintColor="#e74c3c"
              maximumTrackTintColor="#ddd"
            />
            <Value>{Math.round(pulse)}</Value>
          </Row>
          
          <Button onPress={simulateData}>
            <ButtonText>Enviar datos</ButtonText>
          </Button>
        </>
      )}
      
      {autoMode && (
        <Button onPress={simulateData} style={{ backgroundColor: '#27ae60' }}>
          <ButtonText>Simular ahora</ButtonText>
        </Button>
      )}
      
      {status && (
        <StatusText success={status.includes('✅')}>
          {status}
        </StatusText>
      )}
    </SimulatorContainer>
  );
};

export default CollarSimulator;