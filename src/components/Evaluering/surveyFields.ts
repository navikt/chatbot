export type SurveyQuestion = {
    label: string;
    event: string;
    options: string[];
    type: 'radio' | 'checkbox';
};

export type SurveyData = {
    [key: string]: string[];
};

export const defaultSurvey: SurveyQuestion[] = [
    {
        label: 'Fikk du svar på det du lurte på?',
        event: 'fullforing',
        options: ['Ja', 'Nei', 'Delvis'],
        type: 'radio',
    },
    {
        label: 'Hva kom du hit for å gjøre?',
        event: 'oppgaver',
        options: [
            'Levere sykemelding',
            'Sjekke eller oppdatere aktivitetsplanen',
            'Sjekke status eller følge opp sykemelding',
            'Sjekke status på søknaden eller saken min',
            'Sjekke status på utbetalinger',
            'Sende meldekort',
            'Sende skjema eller søknad',
            'Sende melding eller svar til NAV',
            'Lese meldinger fra NAV',
            'Finne informasjon og forstå mine rettigheter',
            'Finne ledige stillinger eller søke jobb',
            'Finne statistikk, analyse eller forskning',
            'Sjekke eller oppdatere oppfølgingsplanen',
            'Annet',
        ],
        type: 'checkbox',
    },
    {
        label: 'Er du fornøyd med hjelpen du fikk?',
        event: 'tilfredshet',
        options: [
            'Jeg er veldig fornøyd',
            'Jeg er fornøyd',
            'Jeg er misfornøyd',
            'Jeg er veldig misfornøyd',
        ],
        type: 'radio',
    },
];