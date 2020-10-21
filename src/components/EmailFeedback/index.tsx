import React, {ChangeEvent, FormEvent, useState} from 'react';
import axios from 'axios';
import {Config, Tidigjen} from '../Interaksjonsvindu';
import {EmailSend} from '../../api/sessions';
import tema from '../../tema/tema';
import {
    Container,
    Feilmelding,
    Form,
    Suksessmelding,
    UthevetTekst
} from './styles';
import {Knapp} from 'nav-frontend-knapper';
import {Input} from 'nav-frontend-skjema';
import {Normaltekst, Undertittel} from 'nav-frontend-typografi';

const validateEmail = (email: string) =>
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([a-z\-\d]+\.)+[a-z]{2,}))$/i.test(
        email
    );

const sendEmail = async (url: string, email: string) =>
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
            alt: 'NAV Kontaktsenter'
        },
        layout: {
            topBackgroundColor: '#FFFFFF',
            topLineColor: '#555555',
            bottomLineColor: '#c30000',
            textStyle:
                'font-size:' +
                tema.storrelser.tekst.generell +
                ';font-family:' +
                tema.tekstFamilie
        }
    } as EmailSend);

type Props = {
    baseUrl: string;
    config: Config;
    tidIgjen: Tidigjen;
};

export default function EmailFeedback({baseUrl, config, tidIgjen}: Props) {
    const [emailInput, setEmailInput] = useState<string>('');
    const [emailSentTo, setEmailSentTo] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setErrorMessage('');
        setEmailInput(event.target.value);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!emailInput) {
            setErrorMessage('Skriv inn din e-post adresse');
            return;
        }

        if (!validateEmail(emailInput)) {
            setErrorMessage('E-post adressen er ikke gyldig');
            return;
        }

        sendEmail(`${baseUrl}/sessions/${config.sessionId}/email`, emailInput)
            .then(() => {
                setErrorMessage('');
                setEmailSentTo(emailInput);
            })
            .catch((error) => {
                setErrorMessage(
                    'Sending feilet - dobbeltsjekk e-post adressen og prøv igjen'
                );

                console.log(`Error sending chatlog to email ${emailInput}`);
                console.error(error);
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
                    feil={Boolean(errorMessage)}
                />

                <Knapp htmlType={'submit'} kompakt={true}>
                    {'Send'}
                </Knapp>
            </Form>

            {errorMessage && <Feilmelding>{errorMessage}</Feilmelding>}
            {emailSentTo && (
                <Suksessmelding>
                    {`E-post ble sendt til ${emailSentTo}`}
                </Suksessmelding>
            )}
        </Container>
    );
}
