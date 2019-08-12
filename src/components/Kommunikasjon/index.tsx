import React, { Component } from 'react';
import MetaInfo from '../MetaInfo';
import {
    Brukerbilde,
    Container,
    Hoyre,
    Indre,
    Snakkeboble,
    Venstre
} from './styles';

export type Beskjed = {
    arguments: any[] | null;
    content: string;
    id: number;
    nickName: string;
    role: 0 | 1;
    sent: string;
    type:
        | 'Message'
        | 'Event'
        | 'Intro'
        | 'Option'
        | 'OptionResult'
        | 'Command'
        | 'Reaction'
        | 'UserInfo'
        | 'Template';
    userId: number;
};

export type KommunikasjonProps = {
    Beskjed: Beskjed;
};

export type KommunikasjonState = {
    side: 'VENSTRE' | 'HOYRE';
    visBilde: boolean;
};

interface BrukerMedBilde {
    nickName: string;
    harBlittVist: boolean;
}

export default class Kommunikasjon extends Component<
    KommunikasjonProps,
    KommunikasjonState
> {
    constructor(props: KommunikasjonProps) {
        super(props);
        this.state = {
            side: 'VENSTRE',
            visBilde: false
        };
    }

    componentDidMount() {
        let settBruker;
        if (sessionStorage.getItem('brukereSett')) {
            const brukereSett: BrukerMedBilde[] = JSON.parse(
                sessionStorage.getItem('brukereSett') as string
            );
            settBruker = brukereSett.filter(
                (bruker: BrukerMedBilde) =>
                    bruker.nickName === this.props.Beskjed.nickName
            )[0];
            if (!settBruker) {
                if (this.props.Beskjed.role === 1) {
                    brukereSett.push({
                        nickName: this.props.Beskjed.nickName,
                        harBlittVist: true
                    });
                }
            } else {
                brukereSett[
                    brukereSett.indexOf(settBruker)
                ].harBlittVist = true;
            }
            sessionStorage.setItem('brukereSett', JSON.stringify(brukereSett));
        } else {
            settBruker = {
                nickName: this.props.Beskjed.nickName,
                harBlittVist: false
            } as BrukerMedBilde;
            sessionStorage.setItem('brukereSett', JSON.stringify([settBruker]));
        }
        this.setState({
            side: this.props.Beskjed.role === 1 ? 'VENSTRE' : 'HOYRE',
            visBilde: settBruker ? !settBruker.harBlittVist : true
        });
    }

    render() {
        const { nickName, sent, content } = this.props.Beskjed;
        return (
            <Container>
                <MetaInfo
                    nickName={nickName}
                    sent={sent}
                    side={this.state.side}
                />
                <Indre>
                    {this.state.visBilde && this.state.side === 'VENSTRE' && (
                        <Venstre>
                            <Brukerbilde />
                        </Venstre>
                    )}
                    <Hoyre
                        side={this.state.side}
                        visBilde={this.state.visBilde}
                    >
                        <Snakkeboble
                            dangerouslySetInnerHTML={{
                                __html: unescape(content)
                            }}
                            side={this.state.side}
                            visBilde={this.state.visBilde}
                        />
                    </Hoyre>
                </Indre>
            </Container>
        );
    }
}
