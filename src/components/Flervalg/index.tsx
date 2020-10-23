import React, {useEffect, useState} from 'react';
import {Message} from '../../api/sessions';
import MetaInfo from '../MetaInfo';
import Skriveindikator from '../Skriveindikator';
import {Boks, Valg, ValgBoks} from './styles';

type Properties = {
    beskjed: Message;
    harBlittBesvart: boolean;
    fridaHarSvart: boolean;
    velg: (messageId: number, valg: string) => void;
    sisteBrukerId: number | null;
};

export interface ValgProperties {
    isChosen?: boolean;
    isActive?: boolean;
    isCollapsed?: boolean;
}

const Flervalg = ({
    beskjed,
    harBlittBesvart,
    fridaHarSvart,
    velg,
    sisteBrukerId
}: Properties) => {
    const [choice, setChoice] = useState<number>(-1);
    const isCollapsed = Boolean(
        sisteBrukerId && sisteBrukerId === beskjed.userId
    );
    const hasChosen = harBlittBesvart || choice >= 0;

    useEffect(() => {
        const index = beskjed.content.findIndex(
            (item: {isChosen: boolean}) => item.isChosen
        );

        setChoice(index);
    }, []);

    const options = beskjed.content.map(
        (item: {tekst: string}, index: number) => {
            const isChosen = index === choice;

            return (
                <Valg
                    key={item.tekst}
                    isChosen={isChosen}
                    isActive={hasChosen}
                    tabIndex={-1}
                >
                    <button
                        type='button'
                        tabIndex={0}
                        onClick={() => {
                            if (!hasChosen) {
                                setChoice(index);
                                velg(beskjed.id, item.tekst);
                            }
                        }}
                    >
                        <span>{item.tekst}</span>

                        {isChosen && !fridaHarSvart && (
                            <Skriveindikator visIndikator />
                        )}
                    </button>
                </Valg>
            );
        }
    );

    return (
        <Boks isCollapsed={isCollapsed}>
            {!isCollapsed && (
                <MetaInfo
                    nickName={beskjed.nickName}
                    sent={beskjed.sent}
                    side='VENSTRE'
                />
            )}

            <ValgBoks>{options}</ValgBoks>
        </Boks>
    );
};

export default Flervalg;
