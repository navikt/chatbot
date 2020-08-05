import styled from 'styled-components';
import tema from '../../tema/tema';
import { liten } from '../../tema/mediaqueries';

interface Props {
    erApen: boolean;
}

export const Container = styled.div`
    width: ${(props: Props) => (props.erApen ? tema.bredde : 'fit-content')};
    height: ${(props: Props) => (props.erApen ? tema.hoyde : '68px')};
    border-radius: ${(props: Props) => (props.erApen ? '0' : '50%')};
    background: ${(props: Props) => (props.erApen ? '#fff' : 'transparent')};
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 1px solid
        ${(props: Props) => (props.erApen ? '#B5B5B5' : 'transparent')};
    box-shadow: 6px 6px 6px 0
        rgba(0, 0, 0, ${(props: Props) => (props.erApen ? '.16' : '0')});
    z-index: 9999;
    transition: all 300ms cubic-bezier(0.86, 0, 0.07, 1);

    ${liten} {
        width: ${(props: Props) => (props.erApen ? 'auto' : '68px')};
        height: ${(props: Props) => (props.erApen ? 'auto' : '68px')};
        border-radius: ${(props: Props) => (props.erApen ? '0' : '50%')};
        box-shadow: none;
        border: none;
    }
`;
