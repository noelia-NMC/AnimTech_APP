import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const colors = {
  primary: '#42a8a1',
  secondary: '#5dc1b9',
  accent: '#8ae0db',
  extra: '#b5ffff',
  background: '#f9f9f9',
  white: '#ffffff',
  black: '#000000',
  textPrimary: '#222222',
  textSecondary: '#666666',
};

export const Container = styled.View`
  flex: 1;
  background-color: ${colors.background};
`;

export const Header = styled.View`
  background-color: ${colors.primary};
  padding: 45px 20px 25px;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

export const MenuButton = styled.TouchableOpacity`
  margin-right: 15px;
`;

export const HeaderTitle = styled.Text`
  font-size: 26px;
  font-weight: 800;
  color: ${colors.white};
`;

export const HeaderSubtitle = styled.Text`
  font-size: 15px;
  color: ${colors.white};
  margin-left: 5px;
`;

export const Content = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    padding: 20,
  },
}))``;

export const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const Tile = styled.TouchableOpacity`
  width: 48%;
  background-color: ${colors.white};
  border-radius: 18px;
  margin-bottom: 18px;
  padding: 20px 15px;
  align-items: center;
  justify-content: center;
  elevation: 4;
  shadow-color: ${colors.black};
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  shadow-offset: 0px 3px;
`;

export const TileIcon = styled(Icon)`
  color: ${colors.primary};
  margin-bottom: 10px;
`;

export const TileText = styled.Text`
  font-size: 15px;
  color: ${colors.textPrimary};
  font-weight: 600;
  text-align: center;
`;
