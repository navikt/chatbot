import React, { ChangeEvent, Component, FormEvent } from 'react';
import axios from 'axios';
import Kommunikasjon from '../Kommunikasjon';
import Eventviser from '../Eventviser/';
import {
    Chatlog,
    Interaksjon,
    SendKnappOgTeller,
    Tabbable,
    Tekstfelt,
    Tekstomrade,
    Teller,
    AlertstripeHeader,
    AlertstripeForklarendeTekst,
    AlertstripeSeksjon,
    UthevetTekst
} from './styles';
import Flervalg from '../Flervalg';
import Knapp from '../Knapp';
import Alertstripe from '../Alertstripe';
import { ConnectionConfig } from '../../index';
import Evaluering from '../Evaluering';
import { loadJSON, saveJSON } from '../../services/localStorageService';
import { Message, SurveySend } from '../../api/Sessions';
import { MessageWithIndicator, localStorageKeys } from '../ChatContainer';
import EmailFeedback from '../EmailFeedback';
import moment from 'moment';
import Bekreftelsesboks from '../Bekreftelsesboks';

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
    evaluationMessage?: string;
    visBekreftelse: 'OMSTART' | 'AVSLUTT' | 'NY_FANE' | undefined;
    confirmAvslutt: () => void;
    confirmCancel: () => void;
    confirmOmstart: () => void;
    lukkOgAvslutt: () => void;
    href: string | null;
    feil: boolean;
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
    alive: number;
}

interface Tidigjen {
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
            melding: ''
        };

        this.sendMelding = this.sendMelding.bind(this);
        this.lastHistorie = this.lastHistorie.bind(this);
        this.velg = this.velg.bind(this);
        this.evaluer = this.evaluer.bind(this);
        this.opprettEvaluering = this.opprettEvaluering.bind(this);
        this.scrollTilBunn = this.scrollTilBunn.bind(this);
        this.hentBrukerType = this.hentBrukerType.bind(this);
        this.sendTilLenke = this.sendTilLenke.bind(this);
    }

    async componentDidMount() {
        moment.locale('nb-NO');
        this.tidIgjen = setInterval(() => {
            if (this.props.avsluttet) {
                this.setState(
                    {
                        tidIgjen: {
                            formatert: moment().to(
                                loadJSON(localStorageKeys.MAILTIMEOUT),
                                true
                            ),
                            tid: moment(
                                loadJSON(localStorageKeys.MAILTIMEOUT)
                            ).diff(moment())
                        }
                    },
                    () => {
                        if (
                            this.state.tidIgjen &&
                            this.state.tidIgjen.tid <= 0
                        ) {
                            saveJSON(localStorageKeys.APEN, false);
                            this.props.lukkOgAvslutt();
                        }
                    }
                );
            }
        }, 1000);
    }

    componentWillUnmount(): void {
        clearInterval(this.tidIgjen);
    }

    render() {
        if (!this.props.vis) {
            return null;
        } else {
            const { historie } = this.props;
            const sisteBrukerSomSnakket = historie
                .slice()
                .reverse()
                .find(_historie => _historie.role === 1);
            let sisteBrukerSomSnakketNick;

            if (sisteBrukerSomSnakket) {
                sisteBrukerSomSnakketNick = sisteBrukerSomSnakket.nickName;
            }
            let historieListe = historie.map(
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
                            Du blir nå satt over til en veileder.
                        </Alertstripe>
                    )}
                    {this.props.brukere.length > 0 &&
                        !this.props.iKo &&
                        !harAktiveBrukere &&
                        !this.props.avsluttet && (
                            <Alertstripe type='advarsel'>
                                Det er ikke flere aktive brukere i kanalen.
                            </Alertstripe>
                        )}

                    {this.props.avsluttet && (
                        <Alertstripe type='info'>
                            <AlertstripeSeksjon tabIndex={0}>
                                <AlertstripeHeader>
                                    Chatten er avsluttet.
                                </AlertstripeHeader>
                            </AlertstripeSeksjon>
                            {this.state.tidIgjen &&
                                this.state.tidIgjen.tid >= 0 && (
                                    <AlertstripeSeksjon tabIndex={0}>
                                        <AlertstripeHeader>
                                            Trenger du en kopi?
                                        </AlertstripeHeader>
                                        <AlertstripeForklarendeTekst>
                                            Vi sender deg gjerne chat-dialogen
                                            på e-post.
                                        </AlertstripeForklarendeTekst>
                                        {this.state.tidIgjen && (
                                            <AlertstripeForklarendeTekst>
                                                Du kan få chat-dialogen tilsendt
                                                i{' '}
                                                <UthevetTekst>
                                                    {
                                                        this.state.tidIgjen
                                                            .formatert
                                                    }{' '}
                                                </UthevetTekst>
                                                til.
                                            </AlertstripeForklarendeTekst>
                                        )}
                                        <EmailFeedback
                                            baseUrl={this.props.baseUrl}
                                            config={this.props.config}
                                        />
                                    </AlertstripeSeksjon>
                                )}
                            <AlertstripeSeksjon tabIndex={0}>
                                <AlertstripeHeader>
                                    Evaulering
                                </AlertstripeHeader>
                                <AlertstripeForklarendeTekst>
                                    {loadJSON(localStorageKeys.EVAL)
                                        ? 'Takk for din tilbakemelding!'
                                        : this.props.evaluationMessage
                                        ? this.props.evaluationMessage
                                        : 'Hei! Jeg ønsker å lære av din opplevelse. I hvilken grad fikk du svar på det du lurte på?'}
                                </AlertstripeForklarendeTekst>
                                <Evaluering
                                    evaluer={evaluering =>
                                        this.evaluer(evaluering)
                                    }
                                    baseUrl={this.props.baseUrl}
                                    queueKey={this.props.queueKey}
                                    nickName={
                                        sisteBrukerSomSnakket &&
                                        sisteBrukerSomSnakketNick ===
                                            'Chatbot Frida'
                                            ? sisteBrukerSomSnakketNick
                                            : 'NAV Chat'
                                    }
                                />
                            </AlertstripeSeksjon>
                        </Alertstripe>
                    )}
                    {this.props.feil && (
                        <Alertstripe type='feil'>
                            En feil har oppstått.
                        </Alertstripe>
                    )}
                    <Chatlog role='region' aria-live='polite'>
                        {historieListe}
                    </Chatlog>
                    <Tekstomrade
                        ref={el => (this.formRef = el)}
                        onSubmit={e => this.sendMelding(e)}
                    >
                        <Tekstfelt
                            onKeyDown={e => this.handleKeyDown(e)}
                            onChange={e => this.handleChange(e)}
                            placeholder={'Skriv spørsmålet ditt'}
                            disabled={this.props.avsluttet}
                        />
                        <SendKnappOgTeller>
                            <Knapp
                                disabled={
                                    this.state.melding.length > this.maxTegn ||
                                    this.props.avsluttet
                                }
                                aktiv={this.state.sendt}
                            >
                                {this.state.sendt ? 'Sendt' : 'Send'}
                            </Knapp>
                            <Teller
                                error={this.state.melding.length > this.maxTegn}
                            >
                                {this.state.melding.length} / {this.maxTegn}
                            </Teller>
                        </SendKnappOgTeller>
                    </Tekstomrade>
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
                    `${this.props.baseUrl}/sessions/${
                        this.props.config.sessionId
                    }/messages`,
                    {
                        nickName: 'Bruker',
                        content: this.state.melding.trim(),
                        type: 'Message'
                    }
                );
                this.props.hentHistorie();
                this.scrollTilBunn();
            } catch (e) {
                console.error(e.response);
                this.setState({
                    feil: true
                });
            }

            if (this.formRef) {
                this.formRef.reset();
                this.setState(
                    {
                        sendt: true,
                        melding: ''
                    },
                    () => {
                        this.scrollTilBunn();
                        setTimeout(() => {
                            this.setState({
                                sendt: false
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
                    <Tabbable key={`el-${historie.id}`}>
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
                            ref={e => (this.scrollEl = e)}
                            aria-hidden='true'
                        />
                    </Tabbable>
                );
            case 'Event':
                return (
                    <Tabbable key={`el-${historie.id}`}>
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
                            ref={e => (this.scrollEl = e)}
                            aria-hidden='true'
                        />
                    </Tabbable>
                );
            case 'Option':
                return (
                    <Tabbable key={`el-${historie.id}`}>
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
                            ref={e => (this.scrollEl = e)}
                            aria-hidden='true'
                        />
                    </Tabbable>
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

    scrollTilBunn() {
        if (this.scrollEl) {
            this.scrollEl.scrollIntoView({ behavior: 'smooth' });
        }
    }

    async velg(messageId: number, valg: string) {
        await axios.post(
            `${this.props.baseUrl}/sessions/${
                this.props.config.sessionId
            }/messages`,
            {
                nickName: 'Bruker',
                type: 'OptionResult',
                content: {
                    messageId: messageId,
                    optionChoice: valg,
                    cancelled: false
                }
            }
        );
        this.scrollTilBunn();
    }

    async opprettEvaluering() {
        if (!loadJSON(localStorageKeys.EVAL)) {
            const evaluering = await axios.post(
                `${this.props.baseUrl}/sessions/${
                    this.props.config.sessionId
                }/survey`,
                {
                    nickName: 'Bruker',
                    surveyQuestion:
                        'Jeg vil bli bedre. Evaluer gjerne din chatopplevelse med meg.',
                    surveyMaxScore: 5,
                    surveyMinScore: 1,
                    offerSurvey: true,
                    queueKey: this.props.queueKey
                }
            );
            this.setState({
                evalueringsNokkel: evaluering.data
            });
            this.scrollTilBunn();
        }
    }

    async evaluer(evaluering: number) {
        if (!loadJSON(localStorageKeys.EVAL)) {
            try {
                await axios.post(
                    `${this.props.baseUrl}/sessions/${
                        this.props.config.sessionId
                    }/survey`,
                    {
                        nickName: 'Bruker',
                        surveyQuestion:
                            'Jeg vil bli bedre. Evaluer gjerne din chatopplevelse med meg.',
                        surveyMaxScore: 5,
                        surveyMinScore: 1,
                        offerSurvey: false,
                        queueKey: this.props.queueKey,
                        surveyComment: evaluering,
                        parentSessionId: this.state.evalueringsNokkel
                    } as SurveySend
                );
            } catch (e) {
                this.setState({
                    feil: true
                });
            }
            saveJSON(localStorageKeys.EVAL, evaluering);
            const max = Number.MAX_SAFE_INTEGER - 1000;
            const min = Number.MAX_SAFE_INTEGER - 100000;
            this.props.handterMelding(
                {
                    id: Math.floor(Math.random() * (max - min + 1)) + min,
                    nickName: 'Bruker',
                    sent: new Date().toString(),
                    role: 0,
                    userId: 0,
                    type: 'Evaluation',
                    content: evaluering,
                    showIndicator: false
                },
                true
            );
        }
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
