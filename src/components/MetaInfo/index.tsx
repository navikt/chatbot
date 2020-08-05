import React, { Component } from 'react';
import { Container, NickName } from './styles';
import moment from "moment";

export type MetaInfoProps = {
    nickName?: string;
    sent?: string;
    side?: 'VENSTRE' | 'HOYRE';
    skraTekst?: boolean;
};

export default class MetaInfo extends Component<MetaInfoProps, {}> {
    render() {
        const { nickName, sent } = this.props;
        return (
            <Container side={this.props.side}>
                {nickName !== 'Bruker' && (
                    <NickName aria-hidden='true' side={this.props.side}>
                        {nickName}
                    </NickName>
                )}
                {moment(sent).format("HH:mm")}
            </Container>
        );
    }
}
