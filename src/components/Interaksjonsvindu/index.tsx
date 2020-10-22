import React, {ChangeEvent, Component, FormEvent} from 'react';
import axios from 'axios';
import Kommunikasjon from '../Kommunikasjon';
import Eventviser from '../Eventviser';
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
    Teller
} from './styles';
import Flervalg from '../Flervalg';
import Knapp from '../Knapp';
import {AnalyticsCallback, ConnectionConfig} from '../..';
import Evaluering, {SurveyQuestion} from '../Evaluering';
import {getCookie} from '../../utils/cookies';
import {Message} from '../../api/sessions';
import {MessageWithIndicator} from '../ChatContainer';
import EmailFeedback from '../EmailFeedback';
import moment from 'moment';
import Bekreftelsesboks from '../Bekreftelsesboks';
import {chatStateKeys} from '../../utils/state-utils';
import {Systemtittel} from 'nav-frontend-typografi';
import {updateSelectionState} from '../../utils/eval-state-utils';
import {mobileMaxWidth} from '../../tema/mediaqueries';

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
    visBekreftelse: 'OMSTART' | 'AVSLUTT' | undefined;
    confirmAvslutt: () => void;
    confirmCancel: () => void;
    confirmOmstart: () => void;
    lukk: () => void;
    lukkOgAvslutt: () => void;
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

const minimizeMobileOnLinkClick = (
    event: React.MouseEvent,
    minimizeFunc: () => void
): void => {
    const isLink = (element: HTMLElement | null): boolean => {
        if (!element) {
            return false;
        }

        if (element.tagName?.toLowerCase() === 'a') {
            return true;
        }

        return isLink(element.parentElement);
    };

    if (
        window.innerWidth <= mobileMaxWidth &&
        isLink(event.target as HTMLElement)
    ) {
        minimizeFunc();
    }
};

export default class Interaksjonsvindu extends Component<
    InteraksjonsvinduProps,
    InteraksjonsvinduState
> {
    formRef: HTMLFormElement | null;
    scrollElement: HTMLElement | null;
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
        this.scrollTilBunn = this.scrollTilBunn.bind(this);
        this.hentBrukerType = this.hentBrukerType.bind(this);
    }

    componentDidMount() {
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
                        )
                    }
                });
            }
        }, 1000);

        this.scrollTilBunn(false);
    }

    componentWillUnmount() {
        clearInterval(this.tidIgjen);
    }

    componentWillReceiveProps() {
        this.scrollTilBunn();
    }

    render() {
        if (!this.props.vis) {
            return null;
        }

        const {historie} = this.props;
        const historieListe = historie.map(
            (historieItem: MessageWithIndicator, index: number) => {
                const sisteHistorie: Message =
                    this.props.historie[index - 1] &&
                    this.props.historie[index - 1].content !== 'TYPE_MSG'
                        ? this.props.historie[index - 1]
                        : this.props.historie[index - 2];

                return this.lastHistorie(
                    historieItem,
                    sisteHistorie &&
                        (sisteHistorie.type === 'Message' ||
                        sisteHistorie.type === 'Option' ||
                        sisteHistorie.type === 'Evaluation'
                            ? sisteHistorie.userId
                            : null)
                );
            }
        );

        const harAktiveBrukere =
            this.props.brukere.filter((bruker: Bruker) => bruker.aktiv).length >
            0;

        return (
            <Interaksjon>
                {this.props.visBekreftelse === 'OMSTART' && (
                    <Bekreftelsesboks
                        tekst={
                            'Er du sikker på at du vil starte samtalen på nytt?'
                        }
                        ja={() => this.props.confirmOmstart()}
                        nei={() => this.props.confirmCancel()}
                    />
                )}

                {this.props.visBekreftelse === 'AVSLUTT' && (
                    <Bekreftelsesboks
                        tekst={'Er du sikker på at du vil avslutte samtalen?'}
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
                                analyticsCallback={this.props.analyticsCallback}
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
                    onClick={(event) =>
                        minimizeMobileOnLinkClick(event, this.props.lukk)
                    }
                >
                    {historieListe}
                </Chatlog>

                {!this.props.avsluttet && (
                    <Tekstomrade
                        ref={(element) => {
                            this.formRef = element;
                        }}
                        onSubmit={async (event) => this.sendMelding(event)}
                    >
                        <Tekstfelt
                            onKeyDown={(event) => this.handleKeyDown(event)}
                            onChange={(event) => this.handleChange(event)}
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
                                tabIndex={-1}
                                aria-hidden={true}
                                error={this.state.melding.length > this.maxTegn}
                            >
                                {this.state.melding.length} / {this.maxTegn}
                            </Teller>
                        </SendKnappOgTeller>
                    </Tekstomrade>
                )}
            </Interaksjon>
        );
    }

    async sendMelding(event?: FormEvent<HTMLFormElement>) {
        if (event) {
            event.preventDefault();
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
                        type: 'Message'
                    }
                );

                this.props.hentHistorie();
                this.scrollTilBunn();
            } catch (error) {
                console.error(error.response);
                this.setState({feil: true});
            }

            if (this.formRef) {
                this.formRef.reset();

                this.setState({sendt: true, melding: ''}, () => {
                    this.scrollTilBunn();

                    setTimeout(() => {
                        this.setState({sendt: false});
                    }, 3000);
                });
            }
        }
    }

    lastHistorie(
        message: MessageWithIndicator,
        forrigeHistorieBrukerId: number | null
    ) {
        switch (message.type) {
            case 'Message':
                return (
                    <div key={`el-${message.id}`}>
                        <Kommunikasjon
                            key={message.id}
                            beskjed={message}
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
                            key={`scroll-el-${message.id}`}
                            ref={(element) => {
                                this.scrollElement = element;
                            }}
                            aria-hidden='true'
                        />
                    </div>
                );

            case 'Event':
                return (
                    <div key={`el-${message.id}`}>
                        <Eventviser
                            beskjed={message}
                            skriveindikatorTid={this.props.skriveindikatorTid}
                            brukere={this.props.brukere}
                            hentBrukerType={(brukerId: number) =>
                                this.hentBrukerType(brukerId)
                            }
                        />
                        <div
                            key={`scroll-el-${message.id}`}
                            ref={(element) => {
                                this.scrollElement = element;
                            }}
                            aria-hidden='true'
                        />
                    </div>
                );

            case 'Option': {
                const [lastMessageFromFrida] = this.props.historie
                    .filter((message_) => message_.role === 1)
                    .slice(-1);

                return (
                    <div key={`el-${message.id}`}>
                        <Flervalg
                            beskjed={message}
                            harBlittBesvart={
                                message.content.find(
                                    (b: {tekst: string; valgt: boolean}) =>
                                        b.valgt
                                ) || this.props.avsluttet
                            }
                            velg={async (messageId: number, valg: string) =>
                                this.velg(messageId, valg)
                            }
                            sisteBrukerId={forrigeHistorieBrukerId}
                            scrollTilBunn={() => this.scrollTilBunn()}
                            fridaHarSvart={
                                lastMessageFromFrida.id !== message.id
                            }
                        />
                        <div
                            key={`scroll-el-${message.id}`}
                            ref={(element) => {
                                this.scrollElement = element;
                            }}
                            aria-hidden='true'
                        />
                    </div>
                );
            }

            default:
                return null;
        }
    }

    handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
        this.setState({melding: event.target.value});
    }

    handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (event.keyCode === 13 && !event.shiftKey && this.formRef) {
            event.preventDefault();
            void this.sendMelding();
        }
    }

    scrollTilBunn(smooth = true) {
        if (this.scrollElement && !this.props.avsluttet) {
            this.scrollElement.scrollIntoView({
                behavior: smooth ? 'smooth' : undefined
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
                    messageId,
                    optionChoice: valg,
                    cancelled: false
                }
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
        }

        return undefined;
    }
}
