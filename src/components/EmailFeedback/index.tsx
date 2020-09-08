import React, { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import { Config, Tidigjen } from '../Interaksjonsvindu';
import { EmailSend } from '../../api/Sessions';
import tema from '../../tema/tema';
import {
    Container,
    Feilmelding,
    Form,
    Suksessmelding,
    UthevetTekst,
} from './styles';
import { Knapp } from 'nav-frontend-knapper';
import { Input } from 'nav-frontend-skjema';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

const validateEmail = (email: string) =>
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
        email
    );

const sendEmail = (url: string, email: string) =>
    axios.post(url, {
        toEmailAddress: email,
        emailSubject: 'Chatlog fra NAV',
        fromEmailDisplayName: 'NAV Kontaktsenter',
        preText: 'Hei,[br] her er referatet fra din chatsamtale med oss:',
        postText:
            'Takk for din henvendelse.[br][br]Hilsen,[br] NAV Kontaktsenter',
        timeZoneId: 'W. Europe Standard Time',
        logo: {
            url: 'https://www.nav.no/_public/beta.nav.no/images/logo.png',
            link: 'https://www.nav.no',
            alt: 'NAV Kontaktsenter',
        },
        layout: {
            topBackgroundColor: '#FFFFFF',
            topLineColor: '#555555',
            bottomLineColor: '#c30000',
            textStyle:
                'font-size:' +
                tema.storrelser.tekst.generell +
                ';font-family:' +
                tema.tekstFamilie,
        },
    } as EmailSend);

type Props = {
    baseUrl: string;
    config: Config;
    tidIgjen: Tidigjen;
};

export const EmailFeedback = ({ baseUrl, config, tidIgjen }: Props) => {
    const [emailInput, setEmailInput] = useState<string>('');
    const [emailSentTo, setEmailSentTo] = useState('');
    const [error, setError] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setError('');
        setEmailInput(e.target.value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!emailInput) {
            setError('Skriv inn din e-post adresse');
            return;
        }

        if (!validateEmail(emailInput)) {
            setError('E-post adressen er ikke gyldig');
            return;
        }

        sendEmail(`${baseUrl}/sessions/${config.sessionId}/email`, emailInput)
            .then(() => {
                setError('');
                setEmailSentTo(emailInput);
            })
            .catch((err) => {
                setError(
                    'Sending feilet - dobbeltsjekk e-post adressen og prøv igjen'
                );
                console.error(
                    `Error sending chatlog to email ${emailInput} - ${err}`
                );
            });
    };

    return (
        <Container>
            <Undertittel>{'Trenger du en kopi?'}</Undertittel>
            <Normaltekst>
                {'Vi sender deg gjerne chat-dialogen på e-post. Du kan få' +
                    ' chat-dialogen tilsendt i '}
                <UthevetTekst>{tidIgjen.formatert}</UthevetTekst>
                {' til.'}
            </Normaltekst>
            <Form onSubmit={handleSubmit} noValidate>
                <Input
                    type={'email'}
                    aria-label={'Din e-post'}
                    placeholder={'Din e-post'}
                    onChange={handleChange}
                    feil={!!error}
                />
                <Knapp htmlType={'submit'} kompakt={true}>
                    {'Send'}
                </Knapp>
            </Form>
            {error && <Feilmelding>{error}</Feilmelding>}
            {emailSentTo && (
                <Suksessmelding>
                    {`E-post ble sendt til ${emailSentTo}`}
                </Suksessmelding>
            )}
        </Container>
    );
};

export default EmailFeedback;
