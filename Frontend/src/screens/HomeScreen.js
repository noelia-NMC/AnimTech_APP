import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Container,
  Header,
  HeaderRow,
  HeaderTitle,
  HeaderSubtitle,
  MenuButton,
  Content,
  Grid,
  Tile,
  TileIcon,
  TileText,
} from '../styles/HomeStyles';

const HomeScreen = ({ navigation }) => {
  const tiles = [
    {
      icon: 'dog',
      text: 'Ver Collar',
      screen: 'CollarTabs',
      params: { screen: 'Collar' },
    },
    {
      icon: 'account',
      text: 'Mi Perfil',
      screen: 'Perfil',
    },
    {
      icon: 'history',
      text: 'Historial',
      screen: 'Historial',
    },
    {
      icon: 'cog',
      text: 'Ajustes',
      screen: 'Ajustes',
    },
  ];

  return (
    <Container>
      <Header>
        <HeaderRow>
          <MenuButton onPress={() => navigation.openDrawer()}>
            <Icon name="menu" size={28} color="#fff" />
          </MenuButton>
          <HeaderTitle>        AnimTech</HeaderTitle>
        </HeaderRow>
        <HeaderSubtitle>                  Cuidamos a tu mejor amigo</HeaderSubtitle>
      </Header>

      <Content>
        <Grid>
          {tiles.map((tile, index) => (
            <Tile key={index} onPress={() => navigation.navigate(tile.screen, tile.params)}>
              <TileIcon name={tile.icon} size={36} />
              <TileText>{tile.text}</TileText>
            </Tile>
          ))}
        </Grid>
      </Content>
    </Container>
  );
};

export default HomeScreen;
