
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #8ae0db;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #239089;
`;

export const Input = styled.TextInput`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #5dc1b9;
  border-radius: 5px;
  background-color: #ffffff;
`;

export const Button = styled.TouchableOpacity`
  background-color: #42a8a1;
  padding: 10px;
  border-radius: 5px;
  align-items: center;
  width: 100%;
`;

export const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
`;

export const LinkText = styled.Text`
  margin-top: 10px;
  color: #239089;
`;
