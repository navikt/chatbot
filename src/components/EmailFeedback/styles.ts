import styled, { css } from 'styled-components';
import tema from '../../tema/tema';
import { KnappElement } from '../Knapp/styles';

export const Form = styled.form`
    display: flex;
`;

export const EpostFelt = styled.input`
    border: 1px solid ${tema.farger.tekstfelt};
    padding: 0 15px;
    height: 45px;
    margin-right: 10px;
    border-color: ${(props: { error: boolean }) =>
        props.error
            ? tema.farger.alertstripe.feil.bakgrunn
            : tema.farger.tekstfelt};
    flex: 1;
`;

export const SendKnapp = styled(KnappElement)`
    height: 45px;
    vertical-align: top;
    border-color: ${tema.farger.tekstfelt};
    color: ${tema.farger.tekstfelt};

    ${(props: { aktiv?: boolean; prosent?: number }) =>
        props.prosent &&
        css`
            &:before {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: ${props.prosent}%;
                height: 2px;
                background: red;
            }
        `}
`;

export const Feilmelding = styled.p`
    color: ${tema.farger.alertstripe.feil.bakgrunn};
    margin: 0;
`;

export const Suksessmelding = styled.p`
    color: ${tema.farger.alertstripe.suksess.bakgrunn};
    margin: 0;
`;
