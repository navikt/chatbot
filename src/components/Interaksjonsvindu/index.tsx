import React, { ChangeEvent, Component, FormEvent } from 'react';
import axios from 'axios';
import Kommunikasjon from '../Kommunikasjon';
import Eventviser from '../Eventviser/';
import {
    Alertstripe,
    Avsluttet,
    AvsluttetHeader,
    Chatlog,
    Interaksjon,
    KoblerTil,
    SendKnappOgTeller,
    Tekstfelt,
    Tekstomrade,
    Teller,
} from './styles';
import Flervalg from '../Flervalg';
import Knapp from '../Knapp';
import { AnalyticsCallback, ConnectionConfig } from '../../index';
import Evaluering, { SurveyQuestion } from '../Evaluering';
import { getCookie } from '../../utils/cookies';
import { Message } from '../../api/Sessions';
import { MessageWithIndicator } from '../ChatContainer';
import EmailFeedback from '../EmailFeedback';
import moment from 'moment';
import Bekreftelsesboks from '../Bekreftelsesboks';
import { chatStateKeys } from '../../utils/stateUtils';
import { Systemtittel } from 'nav-frontend-typografi';
import { updateSelectionState } from '../../utils/evalStateUtils';

export interface Bruker {
    userId: number;
    avatarUrl: string;
    userType: string;
    nickName: string;
    role: number;
    aktiv: boolean;
}

interface InteraksjonsvinduProps extends Omit<ConnectionConfig, 'configId'> {
    handterMelding: (melding: MessageWithIndicator, oppdater: boolean) => void;
    skjulIndikator: (melding: MessageWithIndicator) => void;
    vis: boolean;
    baseUrl: string;
    historie: MessageWithIndicator[];
    brukere: Bruker[];
    iKo: boolean;
    avsluttet: boolean;
    config: Config;
    skriveindikatorTid: number;
    hentHistorie: () => void;
    visBekreftelse: 'OMSTART' | 'AVSLUTT' | 'NY_FANE' | undefined;
    confirmAvslutt: () => void;
    confirmCancel: () => void;
    confirmOmstart: () => void;
    lukkOgAvslutt: () => void;
    href: string | null;
    feil: boolean;
    analyticsCallback?: AnalyticsCallback;
    analyticsSurvey?: SurveyQuestion[];
}

type InteraksjonsvinduState = {
    melding: string;
    sendt: boolean;
    feil: boolean;
    evalueringsNokkel: string;
    tidIgjen?: Tidigjen;
};

export interface Config {
    sessionId: string;
    sessionIdPure: string;
    requestId: number;
    lastActive: number;
}

export interface Tidigjen {
    formatert: string;
    tid: number;
}

export default class Interaksjonsvindu extends Component<
    InteraksjonsvinduProps,
    InteraksjonsvinduState
> {
    formRef: HTMLFormElement | null;
    scrollEl: HTMLElement | null;
    tidIgjen: number;
    maxTegn = 110;

    constructor(props: InteraksjonsvinduProps) {
        super(props);

        this.state = {
            evalueringsNokkel: '',
            feil: this.props.feil,
            sendt: false,
            melding: '',
        };

        this.sendMelding = this.sendMelding.bind(this);
        this.lastHistorie = this.lastHistorie.bind(this);
        this.velg = this.velg.bind(this);
        this.scrollTilBunn = this.scrollTilBunn.bind(this);
        this.hentBrukerType = this.hentBrukerType.bind(this);
        this.sendTilLenke = this.sendTilLenke.bind(this);
    }

    async componentDidMount() {
        moment.locale('nb-NO');
        this.tidIgjen = setInterval(() => {
            if (this.props.avsluttet) {
                this.setState({
                    tidIgjen: {
                        formatert: moment().to(
                            getCookie(chatStateKeys.MAILTIMEOUT),
                            true
                        ),
                        tid: moment(getCookie(chatStateKeys.MAILTIMEOUT)).diff(
                            moment()
                        ),
                    },
                });
            }
        }, 1000);
        this.scrollTilBunn(false);
    }

    componentWillUnmount(): void {
        clearInterval(this.tidIgjen);
    }

    componentWillReceiveProps(nextProps: InteraksjonsvinduProps) {
        this.scrollTilBunn();
    }

    render() {
        if (!this.props.vis) {
            return null;
        } else {
            const { historie } = this.props;

            const historieListe = historie.map(
                (historieItem: MessageWithIndicator, index: number) => {
                    const sistehistorie: Message =
                        this.props.historie[index - 1] &&
                        this.props.historie[index - 1].content !== 'TYPE_MSG'
                            ? this.props.historie[index - 1]
                            : this.props.historie[index - 2];
                    return this.lastHistorie(
                        historieItem,
                        sistehistorie &&
                            (sistehistorie.type === 'Message' ||
                            sistehistorie.type === 'Option' ||
                            sistehistorie.type === 'Evaluation'
                                ? sistehistorie.userId
                                : null)
                    );
                }
            );
            const harAktiveBrukere =
                this.props.brukere.filter((bruker: Bruker) => bruker.aktiv)
                    .length > 0;

            return (
                <Interaksjon>
                    {this.props.visBekreftelse &&
                        this.props.visBekreftelse === 'NY_FANE' && (
                            <Bekreftelsesboks
                                tekst={'Åpne i ny fane?'}
                                undertekst={this.props.href}
                                ja={() => this.sendTilLenke()}
                                nei={() => this.props.confirmCancel()}
                            />
                        )}
                    {this.props.visBekreftelse &&
                        this.props.visBekreftelse === 'OMSTART' && (
                            <Bekreftelsesboks
                                tekst={
                                    'Er du sikker på at du vil starte samtalen på nytt?'
                                }
                                ja={() => this.props.confirmOmstart()}
                                nei={() => this.props.confirmCancel()}
                            />
                        )}
                    {this.props.visBekreftelse &&
                        this.props.visBekreftelse === 'AVSLUTT' && (
                            <Bekreftelsesboks
                                tekst={
                                    'Er du sikker på at du vil avslutte samtalen?'
                                }
                                ja={() => this.props.confirmAvslutt()}
                                nei={() => this.props.confirmCancel()}
                            />
                        )}
                    {this.props.iKo && !this.props.avsluttet && (
                        <Alertstripe type='info'>
                            {'Du blir nå satt over til en veileder.'}
                        </Alertstripe>
                    )}
                    {this.props.brukere.length > 0 &&
                        !this.props.iKo &&
                        !harAktiveBrukere &&
                        !this.props.avsluttet && (
                            <Alertstripe type='advarsel'>
                                {'Det er ikke flere aktive brukere i kanalen.'}
                            </Alertstripe>
                        )}
                    {this.props.historie.length > 0 &&
                        this.props.historie.every(
                            (historie: MessageWithIndicator) =>
                                historie.type === 'Intro'
                        ) && (
                            <KoblerTil type='info' form={'inline'}>
                                {'Kobler til Frida...'}
                            </KoblerTil>
                        )}
                    {this.props.avsluttet && (
                        <Avsluttet>
                            <AvsluttetHeader type={'info'} form={'inline'}>
                                <Systemtittel>
                                    {'Chatten er avsluttet.'}
                                </Systemtittel>
                            </AvsluttetHeader>
                            {this.props.analyticsSurvey && (
                                <Evaluering
                                    analyticsCallback={
                                        this.props.analyticsCallback
                                    }
                                    analyticsSurvey={this.props.analyticsSurvey}
                                />
                            )}
                            {this.state.tidIgjen &&
                                this.state.tidIgjen.tid >= 0 && (
                                    <EmailFeedback
                                        baseUrl={this.props.baseUrl}
                                        config={this.props.config}
                                        tidIgjen={this.state.tidIgjen}
                                    />
                                )}
                        </Avsluttet>
                    )}
                    {this.props.feil && (
                        <Alertstripe type='feil'>
                            {'En feil har oppstått.'}
                        </Alertstripe>
                    )}
                    <Chatlog
                        role='log'
                        aria-live='polite'
                        aria-atomic='false'
                        aria-relevant='additions'
                    >
                        {historieListe}
                    </Chatlog>
                    {!this.props.avsluttet && (
                        <Tekstomrade
                            ref={(el) => (this.formRef = el)}
                            onSubmit={(e) => this.sendMelding(e)}
                        >
                            <Tekstfelt
                                onKeyDown={(e) => this.handleKeyDown(e)}
                                onChange={(e) => this.handleChange(e)}
                                placeholder={'Skriv spørsmålet ditt'}
                                disabled={this.props.avsluttet}
                            />
                            <SendKnappOgTeller>
                                <Knapp
                                    disabled={
                                        this.state.melding.length >
                                            this.maxTegn || this.props.avsluttet
                                    }
                                    aktiv={this.state.sendt}
                                >
                                    {this.state.sendt ? 'Sendt' : 'Send'}
                                </Knapp>
                                <Teller
                                    tabIndex={-1}
                                    aria-hidden={true}
                                    error={
                                        this.state.melding.length > this.maxTegn
                                    }
                                >
                                    {this.state.melding.length} / {this.maxTegn}
                                </Teller>
                            </SendKnappOgTeller>
                        </Tekstomrade>
                    )}
                </Interaksjon>
            );
        }
    }

    async sendMelding(e?: FormEvent<HTMLFormElement>) {
        if (e) {
            e.preventDefault();
        }
        if (
            this.state.melding.trim() &&
            this.state.melding.trim().length <= 200 &&
            !this.props.avsluttet
        ) {
            try {
                await axios.post(
                    `${this.props.baseUrl}/sessions/${this.props.config.sessionId}/messages`,
                    {
                        nickName: 'Bruker',
                        content: this.state.melding.trim(),
                        type: 'Message',
                    }
                );
                this.props.hentHistorie();
                this.scrollTilBunn();
            } catch (e) {
                console.error(e.response);
                this.setState({
                    feil: true,
                });
            }

            if (this.formRef) {
                this.formRef.reset();
                this.setState(
                    {
                        sendt: true,
                        melding: '',
                    },
                    () => {
                        this.scrollTilBunn();
                        setTimeout(() => {
                            this.setState({
                                sendt: false,
                            });
                        }, 3000);
                    }
                );
            }
        }
    }

    lastHistorie(
        historie: MessageWithIndicator,
        forrigeHistorieBrukerId: number | null
    ) {
        switch (historie.type) {
            case 'Message':
                return (
                    <div key={`el-${historie.id}`}>
                        <Kommunikasjon
                            key={historie.id}
                            beskjed={historie}
                            brukere={this.props.brukere}
                            sisteBrukerId={forrigeHistorieBrukerId}
                            scrollTilBunn={() => this.scrollTilBunn()}
                            skjulIndikator={(melding: MessageWithIndicator) =>
                                this.props.skjulIndikator(melding)
                            }
                            hentBrukerType={(brukerId: number) =>
                                this.hentBrukerType(brukerId)
                            }
                            skriveindikatorTid={this.props.skriveindikatorTid}
                        />
                        <div
                            key={`scroll-el-${historie.id}`}
                            ref={(e) => (this.scrollEl = e)}
                            aria-hidden='true'
                        />
                    </div>
                );
            case 'Event':
                return (
                    <div key={`el-${historie.id}`}>
                        <Eventviser
                            beskjed={historie}
                            skriveindikatorTid={this.props.skriveindikatorTid}
                            brukere={this.props.brukere}
                            hentBrukerType={(brukerId: number) =>
                                this.hentBrukerType(brukerId)
                            }
                        />
                        <div
                            key={`scroll-el-${historie.id}`}
                            ref={(e) => (this.scrollEl = e)}
                            aria-hidden='true'
                        />
                    </div>
                );
            case 'Option':
                return (
                    <div key={`el-${historie.id}`}>
                        <Flervalg
                            beskjed={historie}
                            harBlittBesvart={
                                historie.content.find(
                                    (b: { tekst: string; valgt: boolean }) =>
                                        b.valgt
                                ) || this.props.avsluttet
                            }
                            velg={(messageId: number, valg: string) =>
                                this.velg(messageId, valg)
                            }
                            sisteBrukerId={forrigeHistorieBrukerId}
                            scrollTilBunn={() => this.scrollTilBunn()}
                        />
                        <div
                            key={`scroll-el-${historie.id}`}
                            ref={(e) => (this.scrollEl = e)}
                            aria-hidden='true'
                        />
                    </div>
                );
            default:
                return;
        }
    }

    handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ melding: e.target.value });
    }

    handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.keyCode === 13 && !e.shiftKey && this.formRef) {
            e.preventDefault();
            this.sendMelding();
        }
    }

    scrollTilBunn(smooth = true) {
        if (this.scrollEl) {
            this.scrollEl.scrollIntoView({
                behavior: smooth ? 'smooth' : undefined,
            });
        }
    }

    async velg(messageId: number, valg: string) {
        await axios.post(
            `${this.props.baseUrl}/sessions/${this.props.config.sessionId}/messages`,
            {
                nickName: 'Bruker',
                type: 'OptionResult',
                content: {
                    messageId: messageId,
                    optionChoice: valg,
                    cancelled: false,
                },
            }
        );
        updateSelectionState(messageId, valg, this.props.historie);
        this.scrollTilBunn();
    }

    hentBrukerType(brukerId: number): string | undefined {
        if (this.props.brukere) {
            const bruker = this.props.brukere.find(
                (b: Bruker) => b.userId === brukerId
            );
            return bruker ? bruker.userType : undefined;
        } else {
            return undefined;
        }
    }

    sendTilLenke() {
        if (this.props.href) {
            window.open(this.props.href, '_blank');
        }
    }
}
