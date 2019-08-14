import styled from 'styled-components';
import tema from '../../tema/tema';

export const Snakkeboble = styled.div`
    font-family: ${tema.tekstFamilie};
    font-size: ${tema.storrelser.tekst.generell};
    padding: 10px;
    background: ${tema.farger.snakkebobler.bot};
    border-radius: 0 7px 0 0;
    word-break: break-word;
    margin-top: 10px;

    a,
    a:visited,
    :link {
        color: ${tema.farger.interaksjon};
    }
`;

export const Container = styled.div`
    border: 2px solid ${tema.farger.snakkebobler.bot};
    background: #fff;
    display: flex;
    justify-content: space-between;
    border-radius: 0 0 7px 7px;
    padding: 15px;
`;

export const Eval = styled.div`
    svg {
        width: 30px;
        height: 30px;
        cursor: pointer;
    }
`;
