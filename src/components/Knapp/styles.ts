import styled from 'styled-components';
import tema from '../../tema/tema';

export type Properties = {aktiv?: boolean};
export const Knapp = styled.button`
    background: ${(properties: Properties) =>
        properties.aktiv ? tema.farger.interaksjon : '#fff'};
    border: 1px solid ${tema.farger.interaksjon};
    color: ${(properties: Properties) =>
        properties.aktiv ? '#fff' : tema.farger.interaksjon};
    cursor: pointer;
    padding: 10px;
    font-family: ${tema.tekstFamilie};
    font-size: ${tema.storrelser.tekst.generell};
    position: relative;

    &:disabled {
        border-color: ${tema.farger.tekst.klokketekst};
        color: ${tema.farger.tekst.klokketekst};
        cursor: default;
    }
`;
