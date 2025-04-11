import { ref, push, get, query, orderByChild, limitToLast } from 'firebase/database';
import { db } from '../config/firebaseConfig';

export const saveReading = async (temperatura, pulso) => {
  const refHist = ref(db, 'historial_collar/collar_001');
  const lectura = {
    temperatura,
    pulso,
    timestamp: new Date().toLocaleString(),
    fecha: Date.now()
  };
  await push(refHist, lectura);
};

export const getLatestReadings = async (limit = 10) => {
  const refHist = ref(db, 'historial_collar/collar_001');
  const q = query(refHist, orderByChild('fecha'), limitToLast(limit));
  const snap = await get(q);
  if (!snap.exists()) return [];
  return Object.entries(snap.val()).map(([id, r]) => ({ id, ...r })).sort((a, b) => b.fecha - a.fecha);
};

export const getStatsByPeriod = async (period = 'day') => {
  const now = Date.now();
  const periodStart = period === 'week' ? now - 7 * 86400000 : period === 'month' ? now - 30 * 86400000 : now - 86400000;
  const snap = await get(ref(db, 'historial_collar/collar_001'));
  if (!snap.exists()) return null;
  const lecturas = Object.values(snap.val()).filter(r => r.fecha >= periodStart);
  if (!lecturas.length) return null;
  const temps = lecturas.map(r => r.temperatura);
  const pulses = lecturas.map(r => r.pulso);
  return {
    tempAvg: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1),
    pulseAvg: Math.round(pulses.reduce((a, b) => a + b, 0) / pulses.length)
  };
};

export const checkVitalSigns = (temperatura, pulso) => {
  const temp = temperatura < 37.5 ? 'danger' : temperatura <= 39.2 ? 'normal' : temperatura <= 39.9 ? 'warning' : 'danger';
  const pulse = pulso < 60 ? 'danger' : pulso <= 100 ? 'normal' : pulso <= 140 ? 'warning' : 'danger';
  return {
    temperature: {
      status: temp,
      message: temp === 'danger' ? 'Temp. crítica' : temp === 'warning' ? 'Temp. elevada' : null
    },
    pulse: {
      status: pulse,
      message: pulse === 'danger' ? 'Pulso crítico' : pulse === 'warning' ? 'Pulso elevado' : null
    }
  };
};