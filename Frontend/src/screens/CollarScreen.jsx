import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, RefreshControl, ActivityIndicator } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebaseConfig';
import {
  Container, Header, Title, Subtitle, StatusContainer, StatusTitle,
  StatusDescription, MetricsContainer, MetricCard, MetricTitle, MetricValue,
  MetricUnit, HistoryContainer, HistoryTitle, HistoryItem, HistoryText,
  HistoryValue, AlertContainer, AlertIcon, AlertText, TabContainer, Tab,
  TabText, ReportContainer, ReportRow, ReportLabel, ReportValue,
  NoDataText
} from '../styles/CollarStyles';
import {
  getLatestReadings,
  getStatsByPeriod,
  checkVitalSigns
} from '../services/colarService';

const CollarScreen = () => {
  const [estado, setEstado] = useState({ temperatura: null, pulso: null, timestamp: '', tempAlert: null, pulseAlert: null });
  const [activeTab, setActiveTab] = useState('actual');
  const [refreshing, setRefreshing] = useState(false);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const collarRef = ref(db, 'collares/collar_001');
    const unsubscribe = onValue(collarRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const { temperatura, pulso, timestamp } = data;
        const estadoTemp = checkVitalSigns(temperatura, pulso);
        setEstado({ temperatura, pulso, timestamp, tempAlert: estadoTemp.temperature.message, pulseAlert: estadoTemp.pulse.message });
      }
      setRefreshing(false);
    });
    return () => unsubscribe();
  }, [refreshing]);

  useEffect(() => {
    const fetchData = async () => {
      setHistory(await getLatestReadings());
      setStats(await getStatsByPeriod('day'));
    };
    fetchData();
  }, [refreshing]);

  const renderContent = () => {
    if (activeTab === 'actual') {
      return (
        <>
          {(estado.tempAlert || estado.pulseAlert) && (
            <AlertContainer>
              <AlertIcon>⚠️</AlertIcon>
              <AlertText>{estado.tempAlert || estado.pulseAlert}</AlertText>
            </AlertContainer>
          )}
          <StatusContainer alert={estado.tempAlert || estado.pulseAlert}>
            <StatusTitle>Estado de Salud</StatusTitle>
            <StatusDescription>
              {!estado.tempAlert && !estado.pulseAlert ? 'Todo normal.' : 'Valores fuera de lo normal.'}
            </StatusDescription>
          </StatusContainer>
          <MetricsContainer>
            <MetricCard color="#42a8a1" alert={!!estado.tempAlert}>
              <MetricTitle>Temperatura</MetricTitle>
              <MetricValue alert={!!estado.tempAlert}>{estado.temperatura ?? '---'}</MetricValue>
              <MetricUnit>°C</MetricUnit>
            </MetricCard>
            <MetricCard color="#d05471" alert={!!estado.pulseAlert}>
              <MetricTitle>Ritmo Cardíaco</MetricTitle>
              <MetricValue alert={!!estado.pulseAlert}>{estado.pulso ?? '---'}</MetricValue>
              <MetricUnit>bpm</MetricUnit>
            </MetricCard>
          </MetricsContainer>
        </>
      );
    } else if (activeTab === 'historial') {
      return (
        <HistoryContainer>
          <HistoryTitle>Historial</HistoryTitle>
          {history.length ? history.map((item, idx) => (
            <HistoryItem key={item.id} isLast={idx === history.length - 1}>
              <View><HistoryText>{item.timestamp}</HistoryText></View>
              <View>
                <HistoryValue alert={checkVitalSigns(item.temperatura, item.pulso).temperature.status !== 'normal'}>
                  🌡️ {item.temperatura}°C
                </HistoryValue>
                <HistoryValue alert={checkVitalSigns(item.temperatura, item.pulso).pulse.status !== 'normal'}>
                  💓 {item.pulso} bpm
                </HistoryValue>
              </View>
            </HistoryItem>
          )) : <NoDataText>No hay datos.</NoDataText>}
        </HistoryContainer>
      );
    } else if (activeTab === 'reporte') {
      return (
        <ReportContainer>
          <HistoryTitle>Reporte Diario</HistoryTitle>
          {stats ? (
            <>
              <ReportRow>
                <ReportLabel>Temp. Promedio</ReportLabel>
                <ReportValue status={checkVitalSigns(stats.tempAvg, stats.pulseAvg).temperature.status}>{stats.tempAvg}°C</ReportValue>
              </ReportRow>
              <ReportRow>
                <ReportLabel>Pulso Promedio</ReportLabel>
                <ReportValue status={checkVitalSigns(stats.tempAvg, stats.pulseAvg).pulse.status}>{stats.pulseAvg} bpm</ReportValue>
              </ReportRow>
            </>
          ) : <NoDataText>No hay estadísticas.</NoDataText>}
        </ReportContainer>
      );
    }
  };

  return (
    <Container refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(true)} />}>
      <Header>
        <Title>Collar Inteligente</Title>
        <Subtitle>Datos en Tiempo Real</Subtitle>
      </Header>
      <TabContainer>
        <Tab active={activeTab === 'actual'} onPress={() => setActiveTab('actual')}><TabText active={activeTab === 'actual'}>Actual</TabText></Tab>
        <Tab active={activeTab === 'historial'} onPress={() => setActiveTab('historial')}><TabText active={activeTab === 'historial'}>Historial</TabText></Tab>
        <Tab active={activeTab === 'reporte'} onPress={() => setActiveTab('reporte')}><TabText active={activeTab === 'reporte'}>Reporte</TabText></Tab>
      </TabContainer>
      {renderContent()}
    </Container>
  );
};

export default CollarScreen;
