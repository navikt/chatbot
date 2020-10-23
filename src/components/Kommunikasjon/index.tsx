import React, {useEffect, useMemo, useState} from 'react';
import {userTypeConstants} from '../../constants';
import MetaInfo from '../MetaInfo';
import {Bruker} from '../Interaksjonsvindu';
import Skriveindikator from '../Skriveindikator';
import {MessageWithIndicator} from '../ChatContainer';
import {
    Brukerbilde,
    Boks,
    Hoyre,
    Innhold,
    Snakkeboble,
    Venstre
} from './styles';

export type Properties = {
    beskjed: MessageWithIndicator;
    sisteBrukerId?: number | null;
    brukere?: Bruker[];
    skriveindikatorTid?: number;
    skjulIndikator?: (melding: MessageWithIndicator) => void;
    hentBrukerType: (brukerId: number) => string | undefined;
};

const Kommunikasjon = (properties: Properties) => {
    const {brukere, beskjed, sisteBrukerId} = properties;
    const {nickName, sent, content, userId, role, showIndicator} = beskjed;
    const alignment = role === 1 ? 'VENSTRE' : 'HOYRE';
    const isPictureVisible = !sisteBrukerId || sisteBrukerId !== userId;
    const [isMessageVisible, setIsMessageVisible] = useState(
        () => !showIndicator || role === 0
    );

    const userType = properties.hentBrukerType(userId);
    const isTypingIndicatorVisible =
        !isMessageVisible &&
        role !== 0 &&
        showIndicator &&
        userType !== userTypeConstants.human;

    const user = useMemo(() => {
        if (brukere) {
            return brukere.find((bruker: Bruker) => bruker.userId === userId);
        }

        return undefined;
    }, [userId, brukere]);

    const choice = useMemo(
        () =>
            unescape(
                escape(content.optionChoice ? content.optionChoice : content)
            ),
        [content]
    );

    useEffect(() => {
        if (!isMessageVisible) {
            const timeout = setTimeout(() => {
                setIsMessageVisible(true);
                properties.skjulIndikator!(beskjed);
            }, properties.skriveindikatorTid);

            return () => {
                clearTimeout(timeout);
            };
        }

        return undefined;
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        setIsMessageVisible(!showIndicator || role === 0);
    }, [showIndicator, role]);

    return (
        <Boks>
            {isPictureVisible && (
                <MetaInfo nickName={nickName} sent={sent} side={alignment} />
            )}

            <Innhold>
                {alignment === 'VENSTRE' && (
                    <Venstre>
                        {isPictureVisible && (
                            <Brukerbilde
                                aria-hidden='true'
                                brukerBilde={user?.avatarUrl}
                            />
                        )}
                    </Venstre>
                )}

                <Hoyre side={alignment}>
                    {isTypingIndicatorVisible && (
                        <Skriveindikator visIndikator={showIndicator} />
                    )}

                    {(isMessageVisible ||
                        userType === userTypeConstants.human) && (
                        <Snakkeboble
                            brukerType={userType}
                            side={alignment}
                            dangerouslySetInnerHTML={{__html: choice}}
                            tabIndex={0}
                        />
                    )}
                </Hoyre>
            </Innhold>
        </Boks>
    );
};

export default Kommunikasjon;
