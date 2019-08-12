import styled from 'styled-components';
import tema from '../../tema/tema';
import Knapp from '../Knapp';

export const Interaksjon = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
`;
export const Chatlog = styled.div`
    height: 100%;
    overflow-y: scroll;
    padding: 15px;
`;
export const Tekstomrade = styled.form`
    margin-top: auto;
    display: flex;
    border-top: 1px solid ${tema.farger.tekstfelt};
    height: 20%;
    padding: 10px;
    align-items: center;
`;
export const Tekstfelt = styled.textarea`
    width: 100%;
    height: 100%;
    resize: none;
    margin-right: 5px;
    border: none;
    font-size: ${tema.storrelser.tekst.generell};
    font-family: ${tema.tekstFamilie};
    scroll-behavior: smooth;

    ::placeholder {
        color: ${tema.farger.tekstfelt};
    }
`;
export const SendKnapp = styled(Knapp)`
    margin-left: auto;
`;
