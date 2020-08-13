import styled, { css } from 'styled-components';
import tema from '../../tema/tema';
import { liten } from '../../tema/mediaqueries';
import { ikonSizePx } from '../FridaKnapp/styles';

interface Props {
    erApen: boolean;
}

const bottomOffset = '50px';
const rightOffset = '50px';

export const Container = styled.div`
    width: fit-content;
    height: ${ikonSizePx};
    background: transparent;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 1px solid transparent;
    box-shadow: 6px 6px 6px 0 rgba(0, 0, 0, 0);
    transition: all 300ms cubic-bezier(0.86, 0, 0.07, 1);

    ${liten} {
        width: fit-content;
        height: ${ikonSizePx};
        box-shadow: none;
        border: none;
    }

    ${(props: Props) =>
        props.erApen &&
        css`
            width: ${tema.bredde};
            height: ${tema.hoyde};
            background: #fff;
            border: 1px solid #b5b5b5;
            box-shadow: 6px 6px 6px 0 rgba(0, 0, 0, 0.16);
            position: fixed;
            bottom: ${bottomOffset};
            right: ${rightOffset};

            @media (max-height: calc(${tema.hoyde} + ${bottomOffset})) {
                top: 0;
                bottom: auto;
            }

            ${liten} {
                width: 100%;
                height: 100%;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
            }
        `};
`;
