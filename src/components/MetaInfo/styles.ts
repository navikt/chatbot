import styled from 'styled-components';
import tema from '../../tema/tema';
import {Properties} from '.';

export const Boks = styled.div`
    color: ${tema.farger.tekst.klokketekst};
    font-family: ${tema.tekstFamilie};
    font-size: ${tema.storrelser.tekst.metaInfo};
    display: flex;
    margin-bottom: 5px;
    justify-content: ${(properties: Properties) =>
        properties.side === 'VENSTRE' ? 'flex-start' : 'flex-end'};
`;

export const Navn = styled.div`
    color: ${(properties: Properties) =>
        properties.side === 'VENSTRE'
            ? tema.farger.tekst.ekstern
            : tema.farger.tekst.klokketekst};
    order: ${(properties: Properties) =>
        properties.side === 'VENSTRE' ? -1 : 1};
    margin: ${(properties: Properties) =>
        properties.side === 'VENSTRE' ? '0 5px 0 0' : '0 0 0 5px'};
`;
