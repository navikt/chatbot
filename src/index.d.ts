declare module '*.svg' {
    const content: any;
    export default content;
}
declare module 'src/tema/tema' {
	 const tema: {
	    bredde: string;
	    hoyde: string;
	    storrelser: {
	        tekst: {
	            generell: string;
	            toppBar: string;
	            metaInfo: string;
	            teller: string;
	        };
	    };
	    farger: {
	        snakkebobler: {
	            bruker: string;
	            agent: string;
	            bot: string;
	        };
	        tekst: {
	            ekstern: string;
	            paragraf: string;
	            klokketekst: string;
	        };
	        toppBar: {
	            ekstern: string;
	            bot: string;
	        };
	        skriveIndikator: {
	            bakgrunn: string;
	            dot: {
	                aktiv: string;
	                inaktiv: string;
	            };
	        };
	        alertstripe: {
	            info: {
	                bakgrunn: string;
	                border: string;
	            };
	            suksess: {
	                bakgrunn: string;
	                border: string;
	            };
	            advarsel: {
	                bakgrunn: string;
	                border: string;
	            };
	            feil: {
	                bakgrunn: string;
	                border: string;
	            };
	            email: {
	                feilmelding: string;
	                bakgrunn: string;
	                inputBakgrunn: string;
	            };
	        };
	        interaksjon: string;
	        valgtInteraksjon: string;
	        tekstfelt: string;
	    };
	    tekstFamilie: string;
	};
	export default tema;

}
declare module 'src/components/ToppBar/index' {
	import { Component } from 'react';
	export type ToppBarProps = {
	    lukk: () => void;
	    avslutt: () => void;
	    omstart: () => void;
	    navn: string | undefined;
	};
	export default class ToppBar extends Component<ToppBarProps, {}> {
	    constructor(props: ToppBarProps);
	    render(): JSX.Element;
	}

}
declare module 'src/components/MetaInfo/index' {
	import { Component } from 'react';
	export type MetaInfoProps = {
	    nickName?: string;
	    sent?: string;
	    side?: 'VENSTRE' | 'HOYRE';
	    skraTekst?: boolean;
	};
	export default class MetaInfo extends Component<MetaInfoProps, {}> {
	    render(): JSX.Element;
	}

}
declare module 'src/components/Skriveindikator/index' {
	import { Component } from 'react';
	import { MessageWithIndicator } from 'src/components/ChatContainer/index'; type SkriveindikatorProps = {
	    beskjed: MessageWithIndicator;
	    skriveindikatorTid: number;
	    gjemAutomatisk: boolean;
	}; type SkriveindikatorState = {
	    vis: boolean;
	};
	export default class Skriveindikator extends Component<SkriveindikatorProps, SkriveindikatorState> {
	    gjemTid: number;
	    constructor(props: SkriveindikatorProps);
	    componentDidMount(): void;
	    componentWillUnmount(): void;
	    render(): JSX.Element | null;
	    setGjemTimeout(): void;
	}
	export {};

}
declare module 'src/components/Kommunikasjon/index' {
	import { Component } from 'react';
	import { Bruker } from 'src/components/Interaksjonsvindu/index';
	import { MessageWithIndicator } from 'src/components/ChatContainer/index';
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
	export default class Kommunikasjon extends Component<KommunikasjonProps, KommunikasjonState> {
	    constructor(props: KommunikasjonProps);
	    componentDidMount(): void;
	    render(): JSX.Element;
	    hentBruker(brukerId: number): Bruker | undefined;
	    hentBrukerbilde(brukerId: number): string | undefined;
	    stripHtml(html: string): string;
	}

}
declare module 'src/components/Eventviser/index' {
	import { Component } from 'react';
	import { KommunikasjonProps } from 'src/components/Kommunikasjon/index';
	export default class Eventviser extends Component<KommunikasjonProps, {}> {
	    constructor(props: KommunikasjonProps);
	    render(): JSX.Element;
	    private visEventTekst;
	}

}
declare module 'src/api/Sessions' {
	export interface Message {
	    id: number;
	    sent: string;
	    role: number;
	    userId: number;
	    nickName: string;
	    type: string;
	    content: any | any[];
	    arguments?: {
	        additionalProp1: {};
	        additionalProp2: {};
	        additionalProp3: {};
	    };
	}
	export interface MessageSend {
	    nickName: string;
	    content: string;
	    type: string;
	}
	export interface SessionCreate {
	    customerKey: string;
	    queueKey: string;
	    nickName: string;
	    chatId: string;
	    languageCode: string;
	    denyArchiving: boolean;
	    intro: SessionCreateIntro;
	}
	export interface SessionCreateResponse {
	    iqSessionId: string;
	    requestId: number;
	}
	export interface EmailSendLogo {
	    url: string;
	    link: string;
	    alt: string;
	}
	export interface EmailSendLayout {
	    topBackgroundColor: string;
	    topLineColor: string;
	    bottomLineColor: string;
	    textStyle: string;
	}
	export interface EmailSend {
	    toEmailAddress: string;
	    emailSubject: string;
	    fromEmailDisplayName: string;
	    preText: string;
	    postText: string;
	    timeZoneId: string;
	    logo: EmailSendLogo;
	    layout: EmailSendLayout;
	}
	export interface SurveySend {
	    nickName: string;
	    surveyQuestion: string;
	    surveyMaxScore: number;
	    surveyMinScore: number;
	    offerSurvey: boolean;
	    queueKey: string;
	}
	export interface ConfigurationResponse {
	    [key: string]: string;
	}
	export interface SessionCreateIntro {
	    /**
	     * Is enduser on a mobile?
	     */
	    isMobile?: boolean;
	    /**
	     * Variables to add
	     */
	    variables?: {
	        [key: string]: string;
	    };
	    /**
	     * Welcome message header
	     */
	    msgWelcomeHeader?: string;
	    /**
	     * Welcome message
	     */
	    msgWelcome?: string;
	    /**
	     * Welcome message when theree are no agents logged on
	     */
	    msgWelcomeEmpty?: string;
	    /**
	     * Welcome message when all agents are in pause
	     */
	    msgWelcomePause?: string;
	    /**
	     * Welcome message when the queue is full
	     */
	    msgWelcomeFull?: string;
	    /**
	     * Welcome message when enduser is rejected to enter queue
	     */
	    msgReject?: string;
	    /**
	     * Show IP Address in intro?
	     */
	    showIpAddress?: boolean;
	    /**
	     * Show Number of endusersr in queue in intro?
	     */
	    showNumberInQueue?: boolean;
	    /**
	     * Show Agents logged on in intro?
	     */
	    showAgentLoggedOn?: boolean;
	    /**
	     * Show active agents in intro?
	     */
	    showAgentActive?: boolean;
	    /**
	     * Show variables in intro?
	     */
	    showVariables?: boolean;
	    /**
	     * Show whether user is on mobile in intro?
	     */
	    showIsMobile?: boolean;
	}

}
declare module 'src/components/Flervalg/index' {
	import { Component } from 'react';
	import { Message } from 'src/api/Sessions'; type FlervalgProps = {
	    beskjed: Message;
	    harBlittBesvart: boolean;
	    velg: (messageId: number, valg: string) => void;
	    sisteBrukerId: number | null;
	    scrollTilBunn?: () => void;
	}; type FlervalgState = {
	    kollaps: boolean;
	};
	export interface ValgProps {
	    valgt?: boolean;
	    aktiv?: boolean;
	    kollaps?: boolean;
	}
	export default class Flervalg extends Component<FlervalgProps, FlervalgState> {
	    constructor(props: FlervalgProps);
	    componentDidMount(): void;
	    render(): JSX.Element;
	}
	export {};

}
declare module 'src/components/Knapp/index' {
	import { Component } from 'react';
	export type KnappProps = {
	    disabled?: boolean;
	    aktiv?: boolean;
	    prosent?: number;
	};
	export default class Knapp extends Component<KnappProps, {}> {
	    render(): JSX.Element;
	}

}
declare module 'src/components/Alertstripe/index' {
	import { Component } from 'react';
	export type AlertstripeProps = {
	    type: 'info' | 'suksess' | 'advarsel' | 'feil';
	};
	export default class Alertstripe extends Component<AlertstripeProps, {}> {
	    componentDidMount(): void;
	    render(): JSX.Element;
	}

}
declare module 'src/services/cookiesService' {
	 const saveJSON: (key: string, data: any) => void; const loadJSON: (key: string) => any; const deleteJSON: (key: string) => void;
	export { saveJSON, loadJSON, deleteJSON };

}
declare module 'src/components/Evaluering/index' {
	import { Component } from 'react'; type EvalueringProps = {
	    evaluer: (evaluering: number) => void;
	    opprettEvaluering: () => void;
	    baseUrl: string;
	    queueKey: string;
	    nickName: string;
	};
	export type EvalueringState = {
	    valgt: boolean;
	    valgtSvar: number;
	};
	export default class Evaluering extends Component<EvalueringProps, EvalueringState> {
	    ratings: any[];
	    checkLoop: number;
	    constructor(props: EvalueringProps);
	    componentDidMount(): void;
	    componentWillUnmount(): void;
	    render(): JSX.Element;
	}
	export {};

}
declare module 'src/components/EmailFeedback/index' {
	import { ChangeEvent, Component, FormEvent } from 'react';
	import { Config } from 'src/components/Interaksjonsvindu/index'; type EmailFeedbackProps = {
	    baseUrl: string;
	    config: Config;
	}; type EmailFeedbackState = {
	    melding: string;
	    tilbakemelding: Tilbakemelding;
	};
	interface Tilbakemelding {
	    error: string;
	    suksess: string;
	}
	export default class EmailFeedback extends Component<EmailFeedbackProps, EmailFeedbackState> {
	    constructor(props: any);
	    render(): JSX.Element;
	    sendMail(e?: FormEvent<HTMLFormElement>): Promise<void>;
	    handleChange(e: ChangeEvent<HTMLInputElement>): void;
	}
	export {};

}
declare module 'src/components/Bekreftelsesboks/index' {
	import { Component } from 'react'; type BekreftelsesboksProps = {
	    tekst?: string;
	    undertekst?: string | null;
	    ja?: () => void;
	    nei?: () => void;
	};
	export default class Bekreftelsesboks extends Component<BekreftelsesboksProps, {}> {
	    componentDidMount(): void;
	    render(): JSX.Element;
	}
	export {};

}
declare module 'src/components/Interaksjonsvindu/index' {
	import React, { ChangeEvent, Component, FormEvent } from 'react';
	import { ConnectionConfig } from 'src/index';
	import { MessageWithIndicator } from 'src/components/ChatContainer';
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
	} type InteraksjonsvinduState = {
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
	export default class Interaksjonsvindu extends Component<InteraksjonsvinduProps, InteraksjonsvinduState> {
	    formRef: HTMLFormElement | null;
	    scrollEl: HTMLElement | null;
	    tidIgjen: number;
	    maxTegn: number;
	    constructor(props: InteraksjonsvinduProps);
	    componentDidMount(): Promise<void>;
	    componentWillUnmount(): void;
	    componentWillReceiveProps(nextProps: InteraksjonsvinduProps): void;
	    render(): JSX.Element | null;
	    sendMelding(e?: FormEvent<HTMLFormElement>): Promise<void>;
	    lastHistorie(historie: MessageWithIndicator, forrigeHistorieBrukerId: number | null): JSX.Element | undefined;
	    handleChange(e: ChangeEvent<HTMLTextAreaElement>): void;
	    handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>): void;
	    scrollTilBunn(): void;
	    velg(messageId: number, valg: string): Promise<void>;
	    opprettEvaluering(): Promise<void>;
	    evaluer(evaluering: number): Promise<void>;
	    hentBrukerType(brukerId: number): string | undefined;
	    sendTilLenke(): void;
	}
	export {};

}
declare module 'src/tema/mediaqueries' {
	export const liten = "@media (max-width: 767px), (max-height: 568px)";

}
declare module 'src/components/ChatContainer/index' {
	import { Component } from 'react';
	import { Bruker, Config } from 'src/components/Interaksjonsvindu/index';
	import { ConnectionConfig } from 'src/index';
	import { AxiosResponse } from 'axios';
	import { ConfigurationResponse, Message, SessionCreateResponse } from 'src/api/Sessions';
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
	    brukereSomSkriver: {
	        [userId: number]: number;
	    };
	    hentHistorie: boolean;
	    visBekreftelse: 'OMSTART' | 'AVSLUTT' | 'NY_FANE' | undefined;
	    lastHref: string | null;
	    feil: boolean;
	};
	export interface ShowIndicator {
	    showIndicator: boolean;
	}
	export interface MessageWithIndicator extends Message, ShowIndicator {
	}
	export const cookieKeys: {
	    CONFIG: string;
	    HISTORIE: string;
	    APEN: string;
	    EVAL: string;
	    MAILTIMEOUT: string;
	};
	export default class ChatContainer extends Component<ConnectionConfig, ChatContainerState> {
	    baseUrl: string;
	    skriveindikatorTid: number;
	    hentHistorieIntervall: number;
	    lesIkkeLastethistorieIntervall: number;
	    leggTilLenkeHandlerIntervall: number;
	    events: Element[];
	    config: ConfigurationResponse;
	    constructor(props: ConnectionConfig);
	    componentDidMount(): void;
	    componentWillUnmount(): void;
	    render(): JSX.Element;
	    start(tving?: boolean, beholdApen?: boolean): Promise<void>;
	    apne(): Promise<void>;
	    lukk(): Promise<void>;
	    omstart(): void;
	    confirmOmstart(): Promise<void>;
	    oppdaterNavn(navn: string): void;
	    avslutt(sporBruker?: boolean): Promise<void>;
	    confirmAvslutt(): Promise<void>;
	    confirmCancel(): void;
	    lukkOgAvslutt(): void;
	    hentConfig(): Promise<AxiosResponse<SessionCreateResponse>>;
	    hentFullHistorie(): Promise<AxiosResponse<any>> | undefined;
	    hentHistorie(): Promise<void>;
	    handterMelding(melding: MessageWithIndicator, oppdater?: boolean): void;
	    leggTilIHistorie(melding: MessageWithIndicator, oppdater?: boolean): void;
	    lesIkkeLastethistorie(): void;
	    skjulIndikator(melding: MessageWithIndicator): void;
	    skjulAlleIndikatorForBruker(brukerId: number): void;
	    leggTilLenkeHandler(): void;
	    settTimerConfig(): Promise<void>;
	}

}
declare module 'src/index' {
	import 'react-app-polyfill/ie11';
	import 'react-app-polyfill/stable';
	import { Component } from 'react';
	export type ConnectionConfig = {
	    queueKey: string;
	    customerKey: string;
	    configId: string;
	    evaluationMessage?: string;
	};
	export default class Chat extends Component<ConnectionConfig, {}> {
	    constructor(props: ConnectionConfig);
	    render(): JSX.Element;
	}

}
