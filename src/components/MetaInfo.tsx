import React, { Component } from 'react';
import Moment from 'react-moment';
import styled from 'styled-components';
import tema from '../tema/tema';

type MetaInfoProps = {
    nickName?: string;
    sent?: string;
    side?: 'VENSTRE' | 'HOYRE';
};

const Konteiner = styled.div`
    color: ${tema.farger.tekst.klokketekst};
    font-family: ${tema.tekstFamilie};
    font-size: ${tema.storrelser.tekst.metaInfo};
    display: flex;
    margin: 10px 0 5px;
    justify-content: ${(props: MetaInfoProps) =>
        props.side === 'VENSTRE' ? 'flex-start' : 'flex-end'};
`;

const NickName = styled.div`
    color: ${tema.farger.tekst.ekstern};
    order: ${(props: MetaInfoProps) => (props.side === 'VENSTRE' ? -1 : 1)};
    margin: ${(props: MetaInfoProps) =>
        props.side === 'VENSTRE' ? '0 5px 0 0' : '0 0 0 5px'};
`;

export default class MetaInfo extends Component<MetaInfoProps, {}> {
    render() {
        const { nickName, sent } = this.props;
        return (
            <Konteiner side={this.props.side}>
                <NickName side={this.props.side}>{nickName}</NickName>
                <Moment format='HH:mm'>{sent}</Moment>
            </Konteiner>
        );
    }
}
