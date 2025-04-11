import React from 'react';
import Swiper from 'react-native-swiper';
import {
  Container,
  Slide,
  SlideImage,
  Title,
  Description,
  StartButton,
  ButtonText,
} from '../styles/WelcomeStyles';

const slides = [
  {
    image: 'https://cdn-icons-png.flaticon.com/512/616/616554.png',
    title: 'Bienvenido a AnimTech',
    description: 'Tecnología para cuidar la salud de tu perro.',
  },
  {
    image: 'https://cdn-icons-png.flaticon.com/512/616/616490.png',
    title: 'Monitorea su temperatura y pulso',
    description: 'Lecturas precisas desde un collar inteligente.',
  },
  {
    image: 'https://cdn-icons-png.flaticon.com/512/616/616489.png',
    title: 'Cuidamos a nuestros peludos',
    description: 'Detección de fiebre e hipotermia en tiempo real.',
  },
];

const WelcomeScreen = ({ navigation }) => {
  return (
    <Container>
      <Swiper loop={false} showsButtons={false} dotColor="#ccc" activeDotColor="#2196f3">
        {slides.map((slide, index) => (
          <Slide key={index}>
            <SlideImage source={{ uri: slide.image }} />
            <Title>{slide.title}</Title>
            <Description>{slide.description}</Description>
            {index === slides.length - 1 && (
              <StartButton onPress={() => navigation.replace('Login')}>
                <ButtonText>Iniciar</ButtonText>
              </StartButton>
            )}
          </Slide>
        ))}
      </Swiper>
    </Container>
  );
};

export default WelcomeScreen;
