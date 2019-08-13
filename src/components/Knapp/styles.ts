import styled from 'styled-components';
import tema from '../../tema/tema';

export const KnappElement = styled.button`
    outline: none;
    background: ${(props: { aktiv: boolean }) =>
        props.aktiv ? tema.farger.interaksjon : '#fff'};
    border: 1px solid ${tema.farger.interaksjon};
    color: ${(props: { aktiv: boolean }) =>
        props.aktiv ? '#fff' : tema.farger.interaksjon};
    cursor: pointer;
    padding: 10px;
    font-family: ${tema.tekstFamilie};
    font-size: ${tema.storrelser.tekst.generell};

    &:disabled {
        border-color: ${tema.farger.tekst.klokketekst};
        color: ${tema.farger.tekst.klokketekst};
        cursor: default;
    }
`;
