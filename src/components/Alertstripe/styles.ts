import styled, { keyframes } from 'styled-components';
import tema from '../../tema/tema';
import { AlertstripeProps } from './index';

import informasjon from '../../assets/informasjon.svg';
import advarsel from '../../assets/advarsel.svg';
import feil from '../../assets/feil.svg';
import suksess from '../../assets/suksess.svg';

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
    animation: ${animIn} 150ms ease-in-out forwards;
    background: ${(props: AlertstripeProps) =>
        tema.farger.alertstripe[props.type.toLowerCase()].bakgrunn};
    border-bottom: 1px solid
        ${(props: AlertstripeProps) =>
            tema.farger.alertstripe[props.type.toLowerCase()].border};
    z-index: 9;
    flex: 0 0 auto;
    min-height: 0;
`;

const ikon = (type: 'info' | 'suksess' | 'advarsel' | 'feil') => {
    switch (type) {
        case 'advarsel':
            return advarsel;
        case 'feil':
            return feil;
        case 'info':
            return informasjon;
        case 'suksess':
            return suksess;
    }
};

export const Ikon = styled.div`
    flex: 0 0 25px;
    height: 25px;
    width: 25px;
    background: red;
    margin-right: 20px;
    background: ${(props: AlertstripeProps) =>
        `transparent url('data:image/svg+xml;base64,${window.btoa(
            ikon(props.type)
        )}') no-repeat center center`};
    align-self: flex-start;
`;

export const Tekst = styled.div`
    flex: 1;

    a,
    a:visited,
    :link {
        color: ${tema.farger.interaksjon};
    }
`;
