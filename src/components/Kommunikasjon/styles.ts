import styled from 'styled-components';
import fridaIkon from '../../assets/frida.svg';
import tema from '../../tema/tema';
import { KommunikasjonState } from './index';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin: 10px 0;
`;

export const Indre = styled.div`
    display: flex;
`;

export const Venstre = styled.div`
    width: 50px;
    height: 50px;
    flex: 0 0 50px;
    margin-right: 10px;
`;

export const Hoyre = styled.div`
    margin-left: ${(props: KommunikasjonState) =>
        props.side === 'VENSTRE' ? undefined : 'auto'};
    max-width: 80%;
`;

export const Brukerbilde = styled.div`
    width: 50px;
    height: 50px;
    background: transparent url('data:image/svg+xml;base64, ${window.btoa(
        fridaIkon
    )}') no-repeat center center;
`;

export const Snakkeboble = styled.div`
    font-family: ${tema.tekstFamilie};
    font-size: ${tema.storrelser.tekst.generell};
    padding: 10px;
    background: ${(props: KommunikasjonState) =>
        props.side === 'VENSTRE'
            ? tema.farger.snakkebobler.bot
            : tema.farger.snakkebobler.bruker};
    border-radius: ${(props: KommunikasjonState) =>
        props.side === 'VENSTRE' ? '0 7px 7px 7px' : '7px 0 7px 7px'};
    word-break: break-word;

    a,
    a:visited,
    :link {
        color: ${tema.farger.interaksjon};
    }
`;
