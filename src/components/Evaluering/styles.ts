import styled from 'styled-components';
import tema from '../../tema/tema';

export const Snakkeboble = styled.div`
    font-family: ${tema.tekstFamilie};
    font-size: ${tema.storrelser.tekst.generell};
    padding: 15px;
    background: ${tema.farger.snakkebobler.bot};
    border-radius: 0 7px 7px 7px;
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
    margin-top: -7px;
    padding-top: 7px;
`;

export const Eval = styled.div`
    padding: 10px;

    svg {
        width: 30px;
        height: 30px;
        cursor: pointer;
        transition: all 150ms ease-in-out;

        &:hover {
            transform: translateY(-5px);
        }
    }
`;

export const Outer = styled.div`
    max-width: 80%;
`;
