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
import { Bruker } from '../Interaksjonsvindu/index';
import rating1 from '../../assets/rating-1.svg';
import rating2 from '../../assets/rating-2.svg';
import rating3 from '../../assets/rating-3.svg';
import rating4 from '../../assets/rating-4.svg';
import rating5 from '../../assets/rating-5.svg';
import Skriveindikator from '../Skriveindikator';
import { MessageWithIndicator } from '../ChatContainer/index';

export type KommunikasjonProps = {
    beskjed: MessageWithIndicator;
    sisteBrukerId?: number | null;
    brukere?: Bruker[];
    skriveindikatorTid: number;
    scrollTilBunn?: () => void;
    skjulIndikator?: (melding: MessageWithIndicator) => void;
    hentBrukerType: (brukerId: number) => string | undefined;
};

export type KommunikasjonState = {
    side: 'VENSTRE' | 'HOYRE';
    visBilde: boolean;
    visMelding?: boolean;
    brukerType?: string;
};

export default class Kommunikasjon extends Component<
    KommunikasjonProps,
    KommunikasjonState
> {
    constructor(props: KommunikasjonProps) {
        super(props);
        this.state = {
            side: this.props.beskjed.role === 1 ? 'VENSTRE' : 'HOYRE',
            visBilde:
                this.props.sisteBrukerId !== this.props.beskjed.userId ||
                !this.props.sisteBrukerId,
            visMelding:
                !this.props.beskjed.showIndicator ||
                this.props.beskjed.role === 0
        };

        this.hentBruker = this.hentBruker.bind(this);
        this.hentBrukerbilde = this.hentBrukerbilde.bind(this);
        this.stripHtml = this.stripHtml.bind(this);
    }

    componentDidMount() {
        if (this.props.scrollTilBunn) {
            this.props.scrollTilBunn();
        }
        if (!this.state.visMelding) {
            setTimeout(() => {
                this.setState(
                    {
                        visMelding: true
                    },
                    () => {
                        if (this.props.scrollTilBunn) {
                            this.props.scrollTilBunn();
                        }
                        this.props.skjulIndikator!(this.props.beskjed);
                    }
                );
            }, this.props.skriveindikatorTid);
        }
    }

    render() {
        const { nickName, sent, content, type, userId } = this.props.beskjed;
        const bruker = this.hentBruker(userId);
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
                escape(content.optionChoice ? content.optionChoice : content)
            );
        }
        return (
            <Container>
                {this.state.visBilde && (
                    <MetaInfo
                        nickName={nickName}
                        sent={sent}
                        side={this.state.side}
                    />
                )}
                <Indre>
                    {this.state.side === 'VENSTRE' && (
                        <Venstre>
                            {this.state.visBilde && (
                                <Brukerbilde
                                    aria-hidden='true'
                                    brukerBilde={this.hentBrukerbilde(userId)}
                                />
                            )}
                        </Venstre>
                    )}
                    <Hoyre
                        side={this.state.side}
                        visBilde={this.state.visBilde}
                    >
                        {!this.state.visMelding &&
                            this.props.beskjed.role !== 0 &&
                            this.props.beskjed.showIndicator &&
                            this.props.hentBrukerType(
                                this.props.beskjed.userId
                            ) !== 'Human' && (
                                <Skriveindikator
                                    beskjed={this.props.beskjed}
                                    skriveindikatorTid={
                                        this.props.skriveindikatorTid
                                    }
                                    gjemAutomatisk={false}
                                />
                            )}
                        {(this.state.visMelding ||
                            this.props.hentBrukerType(
                                this.props.beskjed.userId
                            ) === 'Human') && (
                            <Snakkeboble
                                aria-label={`${
                                    this.state.side === 'VENSTRE'
                                        ? nickName
                                        : 'Du'
                                } ${
                                    type === 'Evaluation'
                                        ? 'ga evaluering'
                                        : 'skrev'
                                }: ${
                                    content.optionChoice
                                        ? content.optionChoice
                                        : this.stripHtml(content)
                                } ${type === 'Evaluation' ? 'av 5' : ''}`}
                                dangerouslySetInnerHTML={{
                                    __html: htmlToRender as string
                                }}
                                side={this.state.side}
                                visBilde={this.state.visBilde}
                                brukerType={
                                    bruker ? bruker.userType : undefined
                                }
                                tabIndex={0}
                            />
                        )}
                    </Hoyre>
                </Indre>
            </Container>
        );
    }

    hentBruker(brukerId: number): Bruker | undefined {
        if (this.props.brukere) {
            return this.props.brukere.find(
                (bruker: Bruker) => bruker.userId === brukerId
            );
        } else {
            return undefined;
        }
    }

    hentBrukerbilde(brukerId: number): string | undefined {
        if (this.props.brukere) {
            const bruker = this.props.brukere.find(
                (bruker: Bruker) => bruker.userId === brukerId
            );
            if (bruker) {
                return bruker.avatarUrl;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    stripHtml(html: string): string {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    }
}
