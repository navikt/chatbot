import React, { Component } from 'react';
import { Container, Indikator, IndikatorDot } from './styles';

type SkriveindikatorProps = {
    visIndikator: boolean;
    skriveindikatorTid: number;
    gjemAutomatisk: boolean;
};

type SkriveindikatorState = {
    vis: boolean;
};

export default class Skriveindikator extends Component<
    SkriveindikatorProps,
    SkriveindikatorState
> {
    gjemTid: number;
    constructor(props: SkriveindikatorProps) {
        super(props);
        this.state = {
            vis: this.props.visIndikator,
        };

        this.setGjemTimeout = this.setGjemTimeout.bind(this);
    }

    componentDidMount(): void {
        this.setGjemTimeout();
    }

    componentWillUnmount(): void {
        clearTimeout(this.gjemTid);
    }

    render() {
        if (this.props.visIndikator) {
            return (
                <Container>
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

    setGjemTimeout() {
        if (this.props.gjemAutomatisk) {
            this.gjemTid = setTimeout(() => {
                this.setState({
                    vis: false,
                });
            }, this.props.skriveindikatorTid - 500);
        }
    }
}
