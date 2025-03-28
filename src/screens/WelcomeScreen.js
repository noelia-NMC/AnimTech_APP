import React from 'react';
import { Container, Title, Description, Button, ButtonText } from '../styles/WelcomeStyles';

const WelcomeScreen = ({ navigation }) => {
  return (
    <Container>
      <Title>Bienvenido a AnimTech</Title>
      <Description>Aplicación para monitorear la salud de tus mascotas.</Description>
      <Button onPress={() => navigation.replace('Login')}>
        <ButtonText>Iniciar</ButtonText>
      </Button>
    </Container>
  );
};

export default WelcomeScreen;
