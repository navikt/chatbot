import styled from 'styled-components';
import fridaIkon from '../../assets/frida.svg';
import defaultIkon from '../../assets/default.svg';

const ikonSize = 68;
const ikonSizePx = `${ikonSize}px`;
const tekstHeight = Math.floor(ikonSize * 0.67);
const tekstHeightPx = `${tekstHeight}px`;
const tekstPadding = `${tekstHeight * 0.4}px`;
const navGra20 = '#c6c2bf';
const navDypBla = '#005B82';

type Props = {
    queueKey: string;
};

export const FridaTekst = styled.span`
    padding: 0 ${tekstPadding};
    color: ${navDypBla};
    white-space: nowrap;
`;

export const FridaIkon = styled.span`
    position: absolute;
    right: calc(-${ikonSizePx} * 0.5);
    width: ${ikonSizePx};
    height: ${ikonSizePx};
    border-radius: ${ikonSizePx};
    transition: transform 100ms ease-out;

    background: ${(props: Props) =>
        props.queueKey === 'Q_CHAT_BOT'
            ? `transparent url('data:image/svg+xml;base64,${window.btoa(
                  fridaIkon
              )}') no-repeat center center`
            : `transparent url('data:image/svg+xml;base64,${window.btoa(
                  defaultIkon
              )}') no-repeat center center`};
`;

export const FridaKnapp = styled.button`
    position: relative;
    display: flex;
    align-items: center;
    width: fit-content;
    height: ${tekstHeightPx};
    cursor: pointer;
    background-color: white;
    border: none;
    padding: 0;
    padding-right: calc(${ikonSizePx} * 0.5);
    box-shadow: inset 0 0 0 2px ${navGra20};
    border-radius: ${tekstHeightPx} 0 0 ${tekstHeightPx};

    &:hover {
        background-color: ${navDypBla};

        ${FridaTekst} {
            color: white;
        }

        ${FridaIkon} {
            transform: scale(1.1);
        }
    }

    &:focus {
        box-shadow: inset 0 0 0 3px ${navDypBla} !important;

        ${FridaIkon} {
            box-shadow: 0 0 0 3px ${navDypBla};
        }
    }
`;
