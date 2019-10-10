import styled from 'styled-components';
import { Container } from '../Alertstripe/styles';
import tema from '../../tema/tema';

export const Boks = styled(Container)`
    background: ${tema.farger.alertstripe.comfirm.bakgrunn};
    border-color: ${tema.farger.alertstripe.comfirm.border};
`;

export const Tekst = styled.div`
    flex: 1 1 auto;
`;

export const Knapp = styled.button`
    border: none;
    background: none;
    padding: 10px;
    cursor: pointer;

    & + & {
        margin-left: 10px;
    }

    svg {
        height: 20px;
        width: 20px;
    }

    &:nth-of-type(1) {
        line,
        path {
            outline: ${tema.farger.alertstripe.suksess.border};
            fill: ${tema.farger.alertstripe.suksess.border};
            stroke: ${tema.farger.alertstripe.suksess.border};
        }
    }

    &:nth-of-type(2) {
        line,
        path {
            outline: ${tema.farger.alertstripe.feil.border};
            fill: ${tema.farger.alertstripe.feil.border};
            stroke: ${tema.farger.alertstripe.feil.border};
        }
    }
`;
