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
    display: flex;
    align-items: center;
    padding-left: ${tekstPadding};
    padding-right: calc(${tekstPadding} + ${ikonSizePx} * 0.5);
    color: ${navDypBla};
    white-space: nowrap;
    height: ${tekstHeightPx};
    box-shadow: inset 0 0 0 2px ${navGra20};
    border-radius: ${tekstHeightPx} 0 0 ${tekstHeightPx};
    background-color: white;
`;

export const FridaIkon = styled.span`
    position: relative;
    right: calc(${ikonSizePx} * 0.5);
    margin-right: calc(-${ikonSizePx} * 0.5);
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
    display: flex;
    align-items: center;
    height: ${tekstHeightPx};
    cursor: pointer;
    background-color: transparent;
    border: none;
    padding: 0;

    &:hover {
        ${FridaTekst} {
            color: white;
            background-color: ${navDypBla};
        }

        ${FridaIkon} {
            transform: scale(1.1);
        }
    }

    &:focus {
        box-shadow: none !important;

        ${FridaTekst} {
            box-shadow: inset 0 0 0 3px ${navDypBla} !important;
        }

        ${FridaIkon} {
            box-shadow: 0 0 0 3px ${navDypBla};
        }
    }
`;
