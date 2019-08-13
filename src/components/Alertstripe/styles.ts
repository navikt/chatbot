import styled, { keyframes } from 'styled-components';
import tema from '../../tema/tema';
import { AlertstripeProps } from './index';

import informasjon from '../../assets/informasjon.svg';
import advarsel from '../../assets/advarsel.svg';

const animIn = keyframes`
    from{
        transform: translateY(-60px);
        margin-bottom: -55px;
    }
    to{
      transform: translateY(0);
      margin-bottom: 0;
  }
`;

export const Container = styled.div`
    padding: 15px;
    display: flex;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    align-items: center;
    height: 55px;
    transform: translateY(-60px);
    margin-bottom: -55px;
    animation: ${animIn} 150ms ease-in-out forwards;
    background: ${(props: AlertstripeProps) =>
        tema.farger.alertstripe[props.type.toLowerCase()].bakgrunn};
`;

export const Ikon = styled.div`
    flex: 0 0 25px;
    height: 25px;
    width: 25px;
    background: red;
    margin-right: 20px;
    background: ${(props: AlertstripeProps) =>
        `transparent url('data:image/svg+xml;base64,${window.btoa(
            props.type === 'INFORMASJON' ? informasjon : advarsel
        )}') no-repeat center center`};
`;

export const Tekst = styled.div`
    font-family: ${tema.tekstFamilie};
    font-size: ${tema.storrelser.tekst.generell};
`;
