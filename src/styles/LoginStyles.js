import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

export const Input = styled.TextInput`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
`;

export const Button = styled.TouchableOpacity`
  background-color: #2196f3;
  padding: 10px;
  border-radius: 5px;
  align-items: center;
  width: 100%;
`;

export const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
`;

export const LinkText = styled.Text`
  margin-top: 10px;
  color: #2196f3;
`;
