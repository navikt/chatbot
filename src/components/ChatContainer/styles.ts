import styled, { css } from 'styled-components';
import tema from '../../tema/tema';
import fridaIkon from '../../assets/frida.svg';
import { liten } from '../../tema/mediaqueries';
import { ChatContainerState } from './index';

export const Container = styled.div`
    width: ${(props: ChatContainerState) =>
        props.erApen ? tema.bredde : '68px'};
    height: ${(props: ChatContainerState) =>
        props.erApen ? tema.hoyde : '68px'};
    border-radius: ${(props: ChatContainerState) =>
        props.erApen ? '0' : '50%'};
    position: fixed;
    bottom: 50px;
    right: 50px;
    background: ${(props: ChatContainerState) =>
        props.erApen
            ? '#fff'
            : `transparent url('data:image/svg+xml;base64,${window.btoa(
                  fridaIkon
              )}') no-repeat center center`};
    background-size: 100%;
    transition: all 300ms cubic-bezier(0.86, 0, 0.07, 1);
    display: flex;
    flex-direction: column;
    border: 1px solid
        ${(props: ChatContainerState) =>
            props.erApen ? '#B5B5B5' : 'transparent'};
    box-shadow: 6px 6px 6px 0
        rgba(
            0,
            0,
            0,
            ${(props: ChatContainerState) => (props.erApen ? '.16' : '0')}
        );

    ${(props: ChatContainerState) =>
        !props.erApen &&
        css`
            transform: translateY(0);

            &:hover {
                transform: translateY(-10px);
            }
        `}

    ${liten} {
        width: ${(props: ChatContainerState) =>
            props.erApen ? 'auto' : '68px'};
        height: ${(props: ChatContainerState) =>
            props.erApen ? 'auto' : '68px'};
        border-radius: ${(props: ChatContainerState) =>
            props.erApen ? '0' : '50%'};
        top: ${(props: ChatContainerState) => (props.erApen ? '0' : undefined)};
        right: ${(props: ChatContainerState) => (props.erApen ? '0' : '20px')};
        bottom: ${(props: ChatContainerState) => (props.erApen ? '0' : '20px')};
        left: ${(props: ChatContainerState) =>
            props.erApen ? '0' : undefined};
        box-shadow: none;
        border: none;
    }
`;

export const FridaKnapp = styled.div`
    width: 100%;
    height: 100%;
    cursor: pointer;
`;
