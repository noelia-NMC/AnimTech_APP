import React, { useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUsuario } from '../services/loginServices';

import {
  Container,
  Title,
  Input,
  Button,
  ButtonText,
  LinkText
} from '../styles/LoginStyles';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await loginUsuario(email, password);
      await AsyncStorage.setItem('userToken', response.data.token);
      Alert.alert('Éxito', 'Inicio de sesión exitoso');
      navigation.replace('MainDrawer');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Fallo en el servidor');
    }
  };

  return (
    <Container>
      <Title>Iniciar Sesión</Title>
      <Input placeholder="Correo Electrónico" value={email} onChangeText={setEmail} />
      <Input placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
      <Button onPress={handleLogin}>
        <ButtonText>Ingresar</ButtonText>
      </Button>
      <LinkText onPress={() => navigation.navigate('Register')}>
        ¿No tienes cuenta? Regístrate aquí
      </LinkText>
    </Container>
  );
};

export default LoginScreen;
