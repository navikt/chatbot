import React, { Component } from 'react';
import MetaInfo from '../MetaInfo';
import {
    Brukerbilde,
    Container,
    Hoyre,
    Indre,
    Snakkeboble,
    Venstre,
} from './styles';
import { Bruker } from '../Interaksjonsvindu';
import Skriveindikator from '../Skriveindikator';
import { MessageWithIndicator } from '../ChatContainer';

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
                this.props.beskjed.role === 0,
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
                        visMelding: true,
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
        const { nickName, sent, content, userId } = this.props.beskjed;
        const bruker = this.hentBruker(userId);
        const htmlToRender = unescape(
            escape(content.optionChoice ? content.optionChoice : content)
        );
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
                                    visIndikator={
                                        this.props.beskjed.showIndicator
                                    }
                                />
                            )}
                        {(this.state.visMelding ||
                            this.props.hentBrukerType(
                                this.props.beskjed.userId
                            ) === 'Human') && (
                            <Snakkeboble
                                dangerouslySetInnerHTML={{
                                    __html: htmlToRender as string,
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
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    }
}
