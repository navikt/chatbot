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
import { Bruker } from '../Interaksjonsvindu';
import rating1 from '../../assets/rating-1.svg';
import rating2 from '../../assets/rating-2.svg';
import rating3 from '../../assets/rating-3.svg';
import rating4 from '../../assets/rating-4.svg';
import rating5 from '../../assets/rating-5.svg';

export type Beskjed = {
    arguments: any[] | null;
    content: any | any[];
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
        | 'Template'
        | 'Evaluation';
    userId: number;
};

export type KommunikasjonProps = {
    beskjed: Beskjed;
    brukere?: Bruker[];
};

export type KommunikasjonState = {
    side: 'VENSTRE' | 'HOYRE';
    visBilde: boolean;
    brukerType?: string;
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

        this.hentBruker = this.hentBruker.bind(this);
    }

    componentDidMount() {
        let settBruker;
        if (sessionStorage.getItem('brukereSett')) {
            const brukereSett: BrukerMedBilde[] = JSON.parse(
                sessionStorage.getItem('brukereSett') as string
            );
            settBruker = brukereSett.filter(
                (bruker: BrukerMedBilde) =>
                    bruker.nickName === this.props.beskjed.nickName
            )[0];
            if (!settBruker) {
                if (this.props.beskjed.role === 1) {
                    brukereSett.push({
                        nickName: this.props.beskjed.nickName,
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
                nickName: this.props.beskjed.nickName,
                harBlittVist: false
            } as BrukerMedBilde;
            sessionStorage.setItem('brukereSett', JSON.stringify([settBruker]));
        }
        this.setState({
            side: this.props.beskjed.role === 1 ? 'VENSTRE' : 'HOYRE',
            visBilde: settBruker ? !settBruker.harBlittVist : true
        });
    }

    render() {
        const { nickName, sent, content, type } = this.props.beskjed;
        const bruker = this.hentBruker(nickName);
        let htmlToRender;
        if (type === 'Evaluation') {
            if (content === 1) {
                htmlToRender = rating1;
            } else if (content === 2) {
                htmlToRender = rating2;
            } else if (content === 3) {
                htmlToRender = rating3;
            } else if (content === 4) {
                htmlToRender = rating4;
            } else if (content === 5) {
                htmlToRender = rating5;
            }
        } else {
            htmlToRender = unescape(
                content.optionChoice ? content.optionChoice : content
            );
        }
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
                            <Brukerbilde aria-hidden='true' />
                        </Venstre>
                    )}
                    <Hoyre
                        side={this.state.side}
                        visBilde={this.state.visBilde}
                    >
                        <Snakkeboble
                            aria-label={`${
                                this.state.side === 'VENSTRE' ? nickName : 'Du'
                            } skrev: ${
                                content.optionChoice
                                    ? content.optionChoice
                                    : content
                            }`}
                            dangerouslySetInnerHTML={{
                                __html: htmlToRender as string
                            }}
                            side={this.state.side}
                            visBilde={this.state.visBilde}
                            brukerType={bruker ? bruker.userType : undefined}
                        />
                    </Hoyre>
                </Indre>
            </Container>
        );
    }

    hentBruker(nickName: string): Bruker | undefined {
        if (this.props.brukere) {
            return this.props.brukere.find(
                (bruker: Bruker) => bruker.nickName === nickName
            );
        } else {
            return undefined;
        }
    }
}
