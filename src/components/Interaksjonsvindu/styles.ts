import styled from 'styled-components';
import tema from '../../tema/tema';

export const Interaksjon = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    overflow-x: hidden;
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
    padding: 15px;
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
    outline: none;

    ::placeholder {
        color: ${tema.farger.tekstfelt};
    }
`;

export const SendKnappOgTeller = styled.div`
    margin-left: auto;
    display: flex;
    flex-direction: column;
`;

export const Teller = styled.div`
    font-size: ${tema.storrelser.tekst.teller};
    font-family: ${tema.tekstFamilie};
    margin-top: 5px;
    color: ${(props: { error: boolean }) =>
        props.error ? 'red' : tema.farger.tekst.klokketekst};
`;
