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
import { Message } from '../../api/Sessions';
import Skriveindikator from '../Skriveindikator';

export type KommunikasjonProps = {
    beskjed: Message;
    sisteBrukerId?: number | null;
    brukere?: Bruker[];
    skriveindikatorTid?: number;
    scrollTilBunn?: () => void;
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
            visMelding: this.props.beskjed.role === 0
        };

        this.hentBruker = this.hentBruker.bind(this);
    }

    componentDidMount() {
        if (this.props.scrollTilBunn) {
            this.props.scrollTilBunn();
        }
        if (this.props.beskjed.role !== 0) {
            setTimeout(() => {
                this.setState(
                    {
                        visMelding: true
                    },
                    () => {
                        if (this.props.scrollTilBunn) {
                            this.props.scrollTilBunn();
                        }
                    }
                );
            }, 3000);
        }
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
                                <Brukerbilde aria-hidden='true' />
                            )}
                        </Venstre>
                    )}
                    <Hoyre
                        side={this.state.side}
                        visBilde={this.state.visBilde}
                    >
                        {!this.state.visMelding &&
                            this.props.beskjed.role !== 0 && (
                                <Skriveindikator
                                    beskjed={this.props.beskjed}
                                    skriveindikatorTid={
                                        this.props.skriveindikatorTid || 3000
                                    }
                                    gjemAutomatisk={false}
                                />
                            )}
                        {this.state.visMelding && (
                            <Snakkeboble
                                aria-label={`${
                                    this.state.side === 'VENSTRE'
                                        ? nickName
                                        : 'Du'
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
                                brukerType={
                                    bruker ? bruker.userType : undefined
                                }
                            />
                        )}
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
