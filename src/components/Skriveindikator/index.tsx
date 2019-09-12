import React, { Component } from 'react';
import { Container, Indikator, IndikatorDot } from './styles';
import MetaInfo from '../MetaInfo';
import { Message } from '../../api/Sessions';

type SkriveindikatorProps = {
    beskjed: Message;
};

type SkriveindikatorState = {
    vis: boolean;
};

export default class Skriveindikator extends Component<
    SkriveindikatorProps,
    SkriveindikatorState
> {
    threshhold = 5500;
    constructor(props: SkriveindikatorProps) {
        super(props);
        this.state = {
            vis: true
        };
    }

    componentDidMount(): void {
        setTimeout(() => {
            this.setState({
                vis: false
            });
        }, 2500);
    }

    render() {
        if (this.state.vis) {
            return (
                <Container>
                    <MetaInfo
                        sent={this.props.beskjed.sent}
                        nickName={this.props.beskjed.nickName}
                        side='VENSTRE'
                    />
                    <Indikator>
                        <IndikatorDot />
                        <IndikatorDot />
                        <IndikatorDot />
                    </Indikator>
                </Container>
            );
        } else {
            return null;
        }
    }
}
