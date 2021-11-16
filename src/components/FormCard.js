import styled from 'styled-components'

const FormCard = styled.div`
  display: flex;
  background: ${props => props.background ? props.background : "white"};
  width: ${props => props.width ? props.width : '100%'};
  height: ${props => props.height ? props.height : '100%'};
  border: ${props => props.border ? props.border : 'none'};
  border-radius: ${props => props.borderRadius ? props.borderRadius : 'none'};
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 1366px) {
    width: 60%;
    height: 80%;
  }

  @media (max-width: 1280px) {
    width: 70%;
    height: 80%;
  }
  
  @media (max-width: 1024px) {
    width: 80%;
    height: 80%;
  }

  @media (max-width: 767px) {
    width: 100%;
    height: 100%;
    background: none;
    border: none;
    box-shadow: none;
  }
`;

export default FormCard;
