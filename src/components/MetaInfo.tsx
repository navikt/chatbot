import React, { Component } from 'react';
import Moment from 'react-moment';
import styled from 'styled-components';
import tema from '../tema/tema';

type MetaInfoProps = {
    nickName?: string;
    sent?: string;
    side?: 'VENSTRE' | 'HOYRE';
};

const Container = styled.div`
    color: ${tema.farger.tekst.klokketekst};
    font-family: ${tema.tekstFamilie};
    font-size: ${tema.storrelser.tekst.metaInfo};
    display: flex;
    margin-bottom: 5px;
    justify-content: ${(props: MetaInfoProps) =>
        props.side === 'VENSTRE' ? 'flex-start' : 'flex-end'};
`;

const NickName = styled.div`
    color: ${(props: MetaInfoProps) =>
        props.side === 'VENSTRE'
            ? tema.farger.tekst.ekstern
            : tema.farger.tekst.klokketekst};
    order: ${(props: MetaInfoProps) => (props.side === 'VENSTRE' ? -1 : 1)};
    margin: ${(props: MetaInfoProps) =>
        props.side === 'VENSTRE' ? '0 5px 0 0' : '0 0 0 5px'};
`;

export default class MetaInfo extends Component<MetaInfoProps, {}> {
    render() {
        const { nickName, sent } = this.props;
        return (
            <Container side={this.props.side}>
                <NickName side={this.props.side}>{nickName}</NickName>
                <Moment format='HH:mm'>{sent}</Moment>
            </Container>
        );
    }
}
