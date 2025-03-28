#include <Wire.h>
#include <ESP8266WiFi.h>
#include <Adafruit_MLX90614.h>
#include "MAX30105.h"
#include "heartRate.h"

// Objetos de sensores
Adafruit_MLX90614 sensorTemp;
MAX30105 sensorPulso;

// Pines I2C personalizados para el ESP8266
#define SDA_PIN D2
#define SCL_PIN D1

// Rangos normales en perros grandes
#define TEMP_NORMAL_MIN 37.5
#define TEMP_NORMAL_MAX 39.2
#define FC_NORMAL_MIN 60
#define FC_NORMAL_MAX 100

// Configuración para el promedio de latidos
const byte NUM_LECTURAS = 10;
byte historialLatidos[NUM_LECTURAS] = {0};
byte indiceLatido = 0;
long tiempoUltimoLatido = 0;
float bpm;
int promedioBPM = 0;
int fallosPulso = 0;

// Ajuste por interferencia del pelaje
const float AJUSTE_POR_PELAJE = 0.8;

// Intervalo entre mediciones (en ms)
unsigned long tiempoUltimaLectura = 0;
const unsigned long INTERVALO_LECTURA = 3000;

void setup() {
  Serial.begin(115200);
  delay(2000);

  Serial.println("===== MONITOREO DE SALUD CANINA INICIADO =====");

  // Inicializar el bus I2C
  Wire.begin(SDA_PIN, SCL_PIN);
  Serial.println("Configurando bus I2C...");
  escanearDispositivosI2C();

  // Inicializar sensor de temperatura
  if (!sensorTemp.begin()) {
    Serial.println("No se detectó el sensor de temperatura (MLX90614).");
  } else {
    Serial.println("Sensor de temperatura listo.");
  }

  // Inicializar sensor de pulso
  if (!sensorPulso.begin(Wire, I2C_SPEED_STANDARD)) {
    Serial.println("No se detectó el sensor de pulso (MAX30102).");
  } else {
    Serial.println("Sensor de pulso listo.");
    
    // Configuración básica del sensor
    sensorPulso.setup();
    sensorPulso.setPulseAmplitudeRed(0x0A);
    sensorPulso.setPulseAmplitudeGreen(0);
    sensorPulso.setPulseAmplitudeIR(0x1F);
    sensorPulso.setSampleRate(200);
    sensorPulso.setFIFOAverage(4);
    sensorPulso.setADCRange(4096);
  }

  Serial.println("=================================================");
}

void loop() {
  if (millis() - tiempoUltimaLectura > INTERVALO_LECTURA) {
    tomarLecturas();
  }

  yield(); // Necesario para el buen funcionamiento del ESP8266
}

void tomarLecturas() {
  tiempoUltimaLectura = millis();
  Serial.println("\n Realizando nueva lectura...");

  // Lectura de temperatura
  float tempCorporal = sensorTemp.readObjectTempC();
  float tempAmbiente = sensorTemp.readAmbientTempC();
  float tempAjustada = tempCorporal + AJUSTE_POR_PELAJE;

  if (tempAjustada < 30 || tempAjustada > 45) {
    Serial.println("Lectura fuera de rango. Verifica la posición del sensor.");
  } else {
    Serial.printf("Temp. Ambiente: %.2f °C\n", tempAmbiente);
    Serial.printf("Temp. Corporal Ajustada: %.2f °C\n", tempAjustada);

    if (tempAjustada < TEMP_NORMAL_MIN) {
      Serial.println("Hipotermia detectada.");
    } else if (tempAjustada > TEMP_NORMAL_MAX) {
      Serial.println("Fiebre detectada.");
    } else {
      Serial.println("Temperatura normal.");
    }
  }

  leerFrecuenciaCardiaca();
  Serial.println("-------------------------------------------------");
}

void leerFrecuenciaCardiaca() {
  long valorIR = sensorPulso.getIR();

  if (valorIR < 50000) {
    fallosPulso++;
    if (fallosPulso > 5) {
      Serial.println("No se detecta pulso. Reajusta el sensor.");
    }
    return;
  } else {
    fallosPulso = 0;
  }

  if (checkForBeat(valorIR)) {
    long intervalo = millis() - tiempoUltimoLatido;
    tiempoUltimoLatido = millis();

    bpm = 60 / (intervalo / 1000.0);
    if (bpm < 40 || bpm > 200) return; // Filtrado de lecturas erráticas

    historialLatidos[indiceLatido++] = (byte)bpm;
    indiceLatido %= NUM_LECTURAS;

    promedioBPM = 0;
    int muestrasValidas = 0;
    for (byte i = 0; i < NUM_LECTURAS; i++) {
      if (historialLatidos[i] > 0) {
        promedioBPM += historialLatidos[i];
        muestrasValidas++;
      }
    }

    if (muestrasValidas > 0) {
      promedioBPM /= muestrasValidas;
      int bpmAjustado = ajustarBPMParaPerros(promedioBPM);

      Serial.printf("Frecuencia Cardiaca: %d lpm\n", bpmAjustado);

      if (bpmAjustado < FC_NORMAL_MIN) {
        Serial.println("Ritmo cardíaco bajo.");
      } else if (bpmAjustado > FC_NORMAL_MAX) {
        Serial.println("Ritmo cardíaco elevado.");
      } else {
        Serial.println("Frecuencia cardíaca normal.");
      }
    }
  }
}

// Ajuste para convertir bpm estimado en base humana al de perros grandes
int ajustarBPMParaPerros(int bpmHumano) {
  return (int)(bpmHumano * 0.85);
}

// Escaneo de dispositivos I2C conectados
void escanearDispositivosI2C() {
  byte error, direccion;
  int encontrados = 0;

  Serial.println("Buscando dispositivos I2C...");
  for (direccion = 1; direccion < 127; direccion++) {
    Wire.beginTransmission(direccion);
    error = Wire.endTransmission();

    if (error == 0) {
      Serial.print("Encontrado en 0x");
      Serial.print(direccion, HEX);

      if (direccion == 0x57) Serial.println(" (MAX30102)");
      else if (direccion == 0x5A) Serial.println(" (MLX90614)");
      else Serial.println(" (Dispositivo desconocido)");

      encontrados++;
    }
  }

  if (encontrados == 0) {
    Serial.println("No se detectaron dispositivos I2C.");
  } else {
    Serial.println("Escaneo I2C finalizado.");
  }
}
