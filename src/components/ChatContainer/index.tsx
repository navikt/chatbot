import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ToppBar from '../ToppBar';
import Interaksjonsvindu, {Bruker, Config} from '../Interaksjonsvindu';
import {Container} from './styles';
import {ConnectionConfig} from '../..';
import axios, {AxiosResponse} from 'axios';
import {getCookie, setCookie} from '../../utils/cookies';
import {
    ConfigurationResponse,
    Message,
    SessionCreate,
    SessionCreateResponse
} from '../../api/sessions';
import moment from 'moment';
import {FridaKnappContainer} from '../FridaKnapp';
import {
    chatStateKeys,
    clearState,
    hasActiveSession,
    loadHistoryCache,
    setHistoryCache,
    updateLastActiveTime
} from '../../utils/state-utils';
import {getEvalState, setEvalState} from '../../utils/eval-state-utils';

export type ChatContainerState = {
    erApen: boolean;
    navn?: string | undefined;
    historie: MessageWithIndicator[];
    ikkeLastethistorie: MessageWithIndicator[];
    brukere: Bruker[];
    config?: Config;
    iKo: boolean;
    sisteMeldingId: number;
    avsluttet: boolean;
    brukereSomSkriver: Record<number, number>;
    hentHistorie: boolean;
    visBekreftelse: 'OMSTART' | 'AVSLUTT' | undefined;
    feil: boolean;
};

const defaultState: ChatContainerState = {
    erApen: false,
    navn: 'Chatbot Frida',
    historie: [],
    ikkeLastethistorie: [],
    config: undefined,
    brukere: [],
    iKo: false,
    sisteMeldingId: 0,
    avsluttet: false,
    brukereSomSkriver: {},
    hentHistorie: true,
    visBekreftelse: undefined,
    feil: false
};

export interface ShowIndicator {
    showIndicator: boolean;
}

export interface MessageWithIndicator extends Message, ShowIndicator {}

export default class ChatContainer extends Component<
    ConnectionConfig,
    ChatContainerState
> {
    baseUrl = 'https://api.puzzel.com/chat/v1';
    skriveindikatorTid = 1000;
    hentHistorieIntervall: number;
    lesIkkeLastethistorieIntervall: number;
    events: Element[] = [];
    config: ConfigurationResponse;

    constructor(props: ConnectionConfig) {
        super(props);

        const historie = loadHistoryCache() || [];
        const sisteMelding = historie
            .slice()
            .reverse()
            .find((_historie: any) => _historie.role === 1);
        const config = getCookie(chatStateKeys.CONFIG);

        this.state = hasActiveSession(config)
            ? {
                  ...defaultState,
                  erApen: getCookie(chatStateKeys.APEN) || false,
                  historie,
                  config,
                  sisteMeldingId: sisteMelding ? sisteMelding.id : 0
              }
            : defaultState;

        this.start = this.start.bind(this);
        this.apne = this.apne.bind(this);
        this.lukk = this.lukk.bind(this);
        this.oppdaterNavn = this.oppdaterNavn.bind(this);
        this.avslutt = this.avslutt.bind(this);
        this.omstart = this.omstart.bind(this);
        this.hentConfig = this.hentConfig.bind(this);
        this.hentFullHistorie = this.hentFullHistorie.bind(this);
        this.handterMelding = this.handterMelding.bind(this);
        this.leggTilIHistorie = this.leggTilIHistorie.bind(this);
        this.lesIkkeLastethistorie = this.lesIkkeLastethistorie.bind(this);
        this.skjulIndikator = this.skjulIndikator.bind(this);
        this.skjulAlleIndikatorForBruker = this.skjulAlleIndikatorForBruker.bind(
            this
        );
        this.confirmAvslutt = this.confirmAvslutt.bind(this);
        this.confirmCancel = this.confirmCancel.bind(this);
        this.confirmOmstart = this.confirmOmstart.bind(this);
        this.lukkOgAvslutt = this.lukkOgAvslutt.bind(this);
        this.settTimerConfig = this.settTimerConfig.bind(this);
    }

    componentDidMount() {
        if (
            !this.props.configId ||
            !this.props.queueKey ||
            !this.props.customerKey
        ) {
            console.error(
                'Mangler påkrevd parameter. Husk å ta med: customerKey, queueKey og configId.'
            );

            this.setState({
                feil: true
            });
        } else if (this.state.erApen) {
            void this.start(false, true);
        }
    }

    componentWillUnmount(): void {
        clearInterval(this.hentHistorieIntervall);
        clearInterval(this.lesIkkeLastethistorieIntervall);
    }

    render() {
        const navn = this.state.navn ?? '';
        const {queueKey, customerKey} = this.props;

        return (
            <Container
                erApen={this.state.erApen}
                tabIndex={this.state.erApen ? 0 : -1}
                aria-label={
                    this.state.erApen ? `Samtalevindu: ${navn}` : undefined
                }
                lang={this.state.erApen ? 'no' : undefined}
                role={this.state.erApen ? 'dialog' : undefined}
            >
                {!this.state.erApen && (
                    <FridaKnappContainer
                        onClick={this.apne}
                        navn={navn}
                        queueKey={this.props.queueKey}
                        label={this.props.label}
                    />
                )}

                {this.state.erApen && (
                    <ToppBar
                        navn={
                            this.state.brukere.some(
                                (bruker: Bruker) => bruker.userType === 'Human'
                            )
                                ? `Chat med NAV`
                                : navn
                        }
                        lukk={async () => this.lukk()}
                        omstart={async () => this.omstart()}
                        avslutt={async () => this.avslutt(true)}
                    />
                )}

                <Interaksjonsvindu
                    handterMelding={(melding, oppdater) =>
                        this.handterMelding(melding, oppdater)
                    }
                    skjulIndikator={(melding: MessageWithIndicator) =>
                        this.skjulIndikator(melding)
                    }
                    vis={this.state.erApen}
                    queueKey={queueKey}
                    customerKey={customerKey}
                    baseUrl={this.baseUrl}
                    historie={this.state.historie}
                    brukere={this.state.brukere}
                    iKo={this.state.iKo}
                    avsluttet={this.state.avsluttet}
                    config={this.state.config!}
                    skriveindikatorTid={this.skriveindikatorTid}
                    hentHistorie={async () => this.hentHistorie()}
                    visBekreftelse={this.state.visBekreftelse}
                    confirmAvslutt={async () => this.confirmAvslutt()}
                    confirmOmstart={async () => this.confirmOmstart()}
                    confirmCancel={async () => this.confirmCancel()}
                    lukk={async () => this.lukk()}
                    lukkOgAvslutt={async () => this.lukkOgAvslutt()}
                    feil={this.state.feil}
                    analyticsCallback={this.props.analyticsCallback}
                    analyticsSurvey={this.props.analyticsSurvey}
                />
            </Container>
        );
    }

    analytics(event: string, data: any) {
        if (this.props.analyticsCallback) {
            this.props.analyticsCallback(event, data);
        }
    }

    async start(tving = false, beholdApen = false, omstart?: boolean) {
        try {
            if (!hasActiveSession(this.state.config) || tving) {
                await this.settTimerConfig();
                await this.hentConfig();

                this.setState({
                    ...defaultState,
                    erApen: beholdApen,
                    historie: [],
                    config: getCookie(chatStateKeys.CONFIG)
                });
            }

            if (beholdApen) {
                setCookie(chatStateKeys.APEN, true);
            }

            if (!this.state.feil && this.state.erApen) {
                const node = ReactDOM.findDOMNode(this) as HTMLElement;
                node.focus();

                if (this.state.historie && this.state.historie.length === 0) {
                    // Henter full historie fra API
                    try {
                        const historie = await this.hentFullHistorie();

                        if (historie) {
                            const data: any[] = historie.data;

                            if (data.length > 0) {
                                for (const historie of data) {
                                    this.handterMelding(historie, true);
                                }
                            }

                            this.setState({erApen: beholdApen});
                        }
                    } catch (error) {
                        console.error(error);
                        this.setState({feil: true});
                    }
                } else {
                    // Har hentet historie fra cache
                    for (const historie of this.state.historie) {
                        this.handterMelding({
                            ...historie,
                            showIndicator: false
                        });
                    }

                    this.setState({erApen: true});
                }

                clearInterval(this.hentHistorieIntervall);
                clearInterval(this.lesIkkeLastethistorieIntervall);

                this.hentHistorieIntervall = setInterval(() => {
                    void this.hentHistorie();
                }, 1000);

                this.lesIkkeLastethistorieIntervall = setInterval(
                    () => this.lesIkkeLastethistorie(),
                    50
                );

                this.analytics('chat-åpen', {
                    komponent: 'frida',
                    omstart
                });
            }
        } catch (error) {
            console.error(error);
            this.setState({feil: true});
        }
    }

    async apne() {
        setCookie(chatStateKeys.APEN, true);
        this.setState({erApen: true});
        void this.start(false, true);
    }

    async lukk() {
        this.setState({erApen: false});
        setCookie(chatStateKeys.APEN, false);
        this.analytics('chat-lukket', {komponent: 'frida'});
    }

    omstart() {
        this.setState({visBekreftelse: 'OMSTART'});
    }

    async confirmOmstart() {
        if (!this.state.avsluttet) await this.avslutt();

        clearInterval(this.hentHistorieIntervall);
        clearInterval(this.lesIkkeLastethistorieIntervall);

        const apen = getCookie(chatStateKeys.APEN) === true;

        clearState();
        setCookie(chatStateKeys.APEN, apen);

        await this.start(true, apen, true);
    }

    oppdaterNavn(navn: string): void {
        if (this.state.navn !== navn) {
            this.setState({navn});
        }
    }

    async avslutt(sporBruker = false) {
        if (sporBruker) {
            if (this.state.avsluttet) {
                this.lukkOgAvslutt();
            } else if (this.state.config) {
                this.setState({visBekreftelse: 'AVSLUTT'});
            }
        } else if (this.state.avsluttet) {
            await this.confirmOmstart();
        } else if (this.state.config) {
            await this.confirmAvslutt();
        }
    }

    async confirmAvslutt() {
        await axios.delete(
            `${this.baseUrl}/sessions/${this.state.config!.sessionId}/${
                this.state.config!.requestId
            }`
        );

        if (!getCookie(chatStateKeys.MAILTIMEOUT)) {
            setCookie(
                chatStateKeys.MAILTIMEOUT,
                moment().add(4.5, 'm').valueOf()
            );
        }

        this.confirmCancel();
        this.analytics('chat-avsluttet', {komponent: 'frida'});
    }

    confirmCancel() {
        this.setState({visBekreftelse: undefined});
    }

    lukkOgAvslutt() {
        clearState();
        this.setState({...defaultState, erApen: false});
    }

    async hentConfig(): Promise<AxiosResponse<SessionCreateResponse>> {
        const session = await axios.post(`${this.baseUrl}/sessions`, {
            customerKey: this.props.customerKey,
            queueKey: this.props.queueKey,
            nickName: 'Bruker',
            chatId: 'bruker@customer.com',
            languageCode: 'NO',
            denyArchiving: false,
            intro: {variables: this.config.variables || undefined}
        } as SessionCreate);

        const customerKey: string = this.props.customerKey ?? '';
        const iqSessionId: string = session.data.iqSessionId ?? '';

        const data: Config = {
            sessionId: `${customerKey}-${iqSessionId}`,
            sessionIdPure: iqSessionId,
            requestId: session.data.requestId,
            lastActive: moment().valueOf()
        };

        setCookie(chatStateKeys.CONFIG, data);
        this.setState({config: data});

        return session;
    }

    hentFullHistorie() {
        if (this.state.config) {
            return axios.get(
                `${this.baseUrl}/sessions/${this.state.config.sessionId}/messages/0`
            );
        }

        return undefined;
    }

    async hentHistorie() {
        if (
            this.state.hentHistorie &&
            this.state.config &&
            !this.state.avsluttet
        ) {
            try {
                const response = await axios.get(
                    `${this.baseUrl}/sessions/${this.state.config.sessionId}/messages/${this.state.sisteMeldingId}`
                );

                const data: Message[] = response.data;

                if (data && data.length > 0) {
                    for (const historie of data) {
                        const showIndicator = historie.content === 'TYPE_MSG';
                        const historieMedIndikator: MessageWithIndicator = {
                            ...historie,
                            showIndicator
                        };

                        this.setState({
                            ikkeLastethistorie: [
                                ...this.state.ikkeLastethistorie,
                                historieMedIndikator
                            ]
                        });
                    }

                    let fantId = false;
                    let sisteId = 1;

                    while (!fantId) {
                        if (data[data.length - sisteId]) {
                            fantId = true;

                            this.setState({
                                sisteMeldingId: data[data.length - sisteId].id
                            });
                        } else {
                            sisteId++;
                        }
                    }
                } else {
                    for (const historie of data) {
                        const historieMedIndikator: MessageWithIndicator = {
                            ...historie,
                            showIndicator: false
                        };

                        this.handterMelding(historieMedIndikator, true);
                    }
                }
            } catch (error) {
                this.setState((state: ChatContainerState) => {
                    return {
                        hentHistorie: false,
                        avsluttet:
                            error.response && error.response.status === 404
                                ? true
                                : state.avsluttet
                    };
                });
            }
        }
    }

    handterMelding(melding: MessageWithIndicator, oppdater = false) {
        if (melding.type === 'UserInfo') {
            if (
                !this.state.brukere.some(
                    (b: Bruker) => b.userId === melding.userId
                )
            ) {
                this.setState((state: ChatContainerState) => {
                    const brukere = state.brukere.concat({
                        userId: melding.userId,
                        avatarUrl: melding.content.avatarUrl,
                        nickName: melding.nickName,
                        role: melding.role,
                        userType: melding.content.userType,
                        aktiv: true
                    });

                    return {brukere};
                });
            }

            if (melding.content.userType === 'Human') {
                setEvalState({...getEvalState(), veileder: true});
                this.setState({iKo: false});
            }
        } else if (melding.type === 'Option') {
            for (let i = 0; i < melding.content.length; i++) {
                const m = melding.content[i];

                if (typeof m === 'string') {
                    melding.content[i] = {
                        tekst: m,
                        valgt: false
                    };
                }
            }
        } else if (melding.type === 'OptionResult') {
            const besvart = this.state.historie.find(
                (_h: any) => _h.id === melding.content.messageId
            );

            if (besvart) {
                const temporary = besvart.content.find(
                    (a: {tekst: string; valgt: boolean}) =>
                        a.tekst.toString() ===
                        melding.content.optionChoice.toString()
                );

                temporary.valgt = true;
            }
        } else if (melding.type === 'Event') {
            if (melding.content === 'USER_DISCONNECTED') {
                this.setState(
                    (state: ChatContainerState) => {
                        const brukere = state.brukere.map((bruker) => {
                            if (bruker.userId === melding.userId) {
                                bruker.aktiv = false;
                            }

                            return bruker;
                        });

                        return {brukere};
                    },
                    () => {
                        const harAktiveBrukere =
                            this.state.brukere.filter(
                                (bruker: Bruker) => bruker.aktiv
                            ).length > 0;

                        if (!this.state.iKo && !harAktiveBrukere) {
                            setTimeout(() => {
                                void this.avslutt();
                            }, 5000);
                        }
                    }
                );
            } else if (melding.content.includes('REQUEST_PUTINQUEUE')) {
                this.setState({iKo: true});
            } else if (melding.content === 'REQUEST_DISCONNECTED') {
                this.setState({avsluttet: true});
            }
        }

        // Refresh timeout hvis bruker skrev melding
        if (
            this.state.config &&
            melding.role === 0 &&
            moment(melding.sent).isAfter(this.state.config.lastActive)
        ) {
            updateLastActiveTime(this.state.config);
        }

        this.skjulAlleIndikatorForBruker(melding.userId);
        this.leggTilIHistorie(melding, oppdater);
    }

    leggTilIHistorie(melding: MessageWithIndicator, oppdater = false) {
        if (
            oppdater &&
            !this.state.historie.some(
                (historie: Message) => historie.id === melding.id
            )
        ) {
            this.setState({historie: [...this.state.historie, melding]});
        }

        setHistoryCache(this.state.historie);
    }

    lesIkkeLastethistorie() {
        const now = moment().valueOf();
        if (this.state.erApen && this.state.ikkeLastethistorie.length > 0) {
            const [historie, ...resten] = this.state.ikkeLastethistorie;
            if (
                historie.role === 1 &&
                (historie.type === 'Message' ||
                    historie.type === 'Option' ||
                    historie.type === 'Evaluation')
            ) {
                const tid = this.state.brukereSomSkriver[historie.userId];

                if (this.state.brukereSomSkriver[historie.userId]) {
                    if (now - tid >= this.skriveindikatorTid) {
                        this.setState(
                            (state: ChatContainerState) => {
                                const brukereSomSkriver = {
                                    ...state.brukereSomSkriver
                                };

                                brukereSomSkriver[historie.userId] = now;

                                return {
                                    brukereSomSkriver,
                                    ikkeLastethistorie: resten
                                };
                            },
                            () => {
                                this.handterMelding(
                                    {...historie, showIndicator: true},
                                    true
                                );
                            }
                        );
                    }
                } else {
                    this.setState((state: ChatContainerState) => {
                        const brukereSomSkriver = {...state.brukereSomSkriver};
                        brukereSomSkriver[historie.userId] = now;

                        return {brukereSomSkriver};
                    });
                }
            } else {
                this.setState({ikkeLastethistorie: resten}, () => {
                    this.handterMelding(historie, true);
                });
            }
        }
    }

    skjulIndikator(melding: MessageWithIndicator) {
        this.setState(
            (state: ChatContainerState) => {
                const historier = [...state.historie];
                const historie = historier.find(
                    (h: MessageWithIndicator) => h.id === melding.id
                );

                if (historie) {
                    const index = historier.indexOf(historie);

                    state.historie[index] = historie;
                    historie.showIndicator = false;

                    return {...state, historie: historier};
                }

                return state;
            },
            () => {
                setHistoryCache(this.state.historie);
            }
        );
    }

    skjulAlleIndikatorForBruker(brukerId: number) {
        const indikatorer = this.state.historie.filter(
            (historie: MessageWithIndicator) =>
                historie.userId === brukerId &&
                historie.content === 'TYPE_MSG' &&
                historie.showIndicator
        );

        indikatorer.forEach((indikator: MessageWithIndicator) => {
            this.setState((state: ChatContainerState) => {
                const historier = [...state.historie];
                indikator.showIndicator = false;

                const index = historier.indexOf(indikator);
                state.historie[index] = indikator;

                return {historie: historier};
            });
        });
    }

    async settTimerConfig() {
        const response = await axios.get(
            `${this.baseUrl}/configurations/${this.props.customerKey}-${this.props.configId}`
        );

        const config = response.data as ConfigurationResponse;

        if (config) {
            const timer = Number.parseInt(config.botMessageTimerMs, 10);
            this.config = response.data;

            if (timer) {
                this.skriveindikatorTid = timer;
            }
        }
    }
}
