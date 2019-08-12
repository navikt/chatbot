import styled from 'styled-components';
import tema from '../../tema/tema';
import { ToppBarProps } from './index';

export const Bar = styled.div`
    border-bottom: 2px solid #000;
    font-family: ${tema.tekstFamilie};
    font-size: ${tema.storrelser.tekst.toppBar};
    margin: 0;
    display: flex;
    background: ${(props: ToppBarProps) =>
        props.navn === 'Net Nordic'
            ? tema.farger.toppBar.bot
            : tema.farger.toppBar.ekstern};
    color: ${(props: ToppBarProps) =>
        props.navn === 'Net Nordic' ? undefined : '#fff'};
    transition: all 300ms ease-in-out;
`;

export const Navn = styled.div`
    flex: 0 1 auto;
    padding: 15px;
`;

export const Knapper = styled.div`
    flex: 0 1 auto;
    display: flex;
    margin-left: auto;
`;

export const Knapp = styled.div`
    flex: 0 1 auto;
    padding: 15px;
    cursor: pointer;

    svg {
        width: 20px;
        height: 20px;

        line,
        path {
            stroke: ${(props: ToppBarProps) =>
                props.navn === 'Net Nordic' ? undefined : '#fff'};
            transition: all 300ms ease-in-out;
        }
    }
`;
