import React, { Component } from 'react';
import { Container, Indikator, IndikatorDot } from './styles';
import { Message } from '../../api/Sessions';

type SkriveindikatorProps = {
    beskjed: Message;
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
            vis: true
        };
    }

    componentDidMount(): void {
        console.log(this.props.skriveindikatorTid);
        if (this.props.gjemAutomatisk) {
            this.gjemTid = setTimeout(() => {
                this.setState({
                    vis: false
                });
            }, this.props.skriveindikatorTid - 500);
        }
    }

    componentWillUnmount(): void {
        clearTimeout(this.gjemTid);
    }

    render() {
        if (this.state.vis) {
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
}
