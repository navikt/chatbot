export interface Message {
    id: number;
    sent: string;
    role: number;
    userId: number;
    nickName: string;
    type: string;
    content: any | any[];
    arguments: {
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
