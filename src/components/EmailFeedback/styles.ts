import styled from 'styled-components';
import tema from '../../tema/tema';

export const Form = styled.form`
    display: flex;
    justify-content: space-between;
    margin: 0.5rem 0;

    .skjemaelement {
        width: 100%;
        margin-right: 0.5rem;
    }
`;

export const Feilmelding = styled.p`
    color: ${tema.farger.alertstripe.email.feilmelding};
    margin: 0;
`;

export const Suksessmelding = styled.p`
    color: #000;
    margin: 0;
`;

export const Container = styled.div`
    margin-top: 2rem;
`;

export const UthevetTekst = styled.span`
    font-weight: bold;
`;
