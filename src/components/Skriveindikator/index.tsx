import React, { Component } from 'react';
import { Container, Indikator, IndikatorDot } from './styles';
import * as moment from 'moment';
import MetaInfo from '../MetaInfo';
import { Beskjed } from '../Kommunikasjon';

type SkriveindikatorProps = {
    beskjed: Beskjed;
};

type SkriveindikatorState = {
    vis: boolean;
};

export default class Skriveindikator extends Component<
    SkriveindikatorProps,
    SkriveindikatorState
> {
    threshhold = -3000;
    constructor(props: SkriveindikatorProps) {
        super(props);
        this.state = {
            vis:
                moment(this.props.beskjed.sent).valueOf() - moment().valueOf() >
                this.threshhold
        };
    }

    componentDidMount(): void {
        setTimeout(() => {
            this.setState({
                vis: false
            });
        }, 5000);
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
