import React, { useState } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import {
  Container,
  Title,
  Input,
  Button,
  ButtonText
} from '../styles/RegisterStyles';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      await axios.post('http://192.168.100.23:5000/api/auth/register', { email, password });
      Alert.alert('Éxito', 'Usuario registrado exitosamente');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Fallo en el servidor');
    }
  };

  return (
    <Container>
      <Title>Registrarse</Title>
      <Input placeholder="Correo Electrónico" value={email} onChangeText={setEmail} />
      <Input placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />
      <Button onPress={handleRegister}>
        <ButtonText>Registrarse</ButtonText>
      </Button>
    </Container>
  );
};

export default RegisterScreen;
