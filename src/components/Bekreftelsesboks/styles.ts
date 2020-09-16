import styled from 'styled-components';
import tema from '../../tema/tema';
import AlertStripe from 'nav-frontend-alertstriper';

export const Boks = styled(AlertStripe)`
    position: absolute !important;
    z-index: 9 !important;
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
    border-radius: 0 !important;
    border-bottom-width: 2px !important;
    width: 100% !important;
`;

export const InnerContainer = styled.div`
    z-index: 9;
    display: flex;
    justify-content: space-between;
`;

export const Tekst = styled.div`
    flex: 1 1 auto;
    max-width: 66%;
`;

export const Undertekst = styled.p`
    margin: 0;
    padding: 0;
    color: ${tema.farger.tekst.klokketekst};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
`;

export const JaKnapp = styled(Knapp)`
    & line,
    & path {
        outline: ${tema.farger.alertstripe.suksess.border};
        fill: ${tema.farger.alertstripe.suksess.border};
        stroke: ${tema.farger.alertstripe.suksess.border};
    }
`;

export const NeiKnapp = styled(Knapp)`
    & line,
    & path {
        outline: ${tema.farger.alertstripe.feil.border};
        fill: ${tema.farger.alertstripe.feil.border};
        stroke: ${tema.farger.alertstripe.feil.border};
    }
`;
