
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

export const Slide = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 30px;
  background-color: #b5ffff;
`;

export const SlideImage = styled.Image`
  width: 200px;
  height: 200px;
  margin-bottom: 30px;
`;

export const Title = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #239089;
  text-align: center;
`;

export const Description = styled.Text`
  font-size: 16px;
  color: #5dc1b9;
  text-align: center;
  margin-top: 10px;
`;

export const StartButton = styled.TouchableOpacity`
  background-color: #42a8a1;
  padding: 12px 30px;
  border-radius: 10px;
  align-self: center;
  margin-top: 40px;
`;

export const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
`;
