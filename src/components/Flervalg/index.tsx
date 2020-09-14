import React, { useEffect, useState } from 'react';
import MetaInfo from '../MetaInfo';
import { Container, Valg, ValgContainer } from './styles';
import { Message } from '../../api/Sessions';
import Skriveindikator from '../Skriveindikator';

type Props = {
    beskjed: Message;
    harBlittBesvart: boolean;
    fridaHarSvart: boolean;
    velg: (messageId: number, valg: string) => void;
    sisteBrukerId: number | null;
    scrollTilBunn?: () => void;
};

export interface ValgProps {
    valgt?: boolean;
    aktiv?: boolean;
    kollaps?: boolean;
}

export const Flervalg = ({
    beskjed,
    harBlittBesvart,
    fridaHarSvart,
    velg,
    sisteBrukerId,
    scrollTilBunn,
}: Props) => {
    const [valgtIndex, setValgtIndex] = useState<number>(-1);
    const kollaps = !!(sisteBrukerId && sisteBrukerId === beskjed.userId);
    const harValgt = harBlittBesvart || valgtIndex >= 0;

    useEffect(() => {
        const index = beskjed.content.findIndex(
            (item: { valgt: boolean }) => item.valgt
        );
        setValgtIndex(index);
    }, []);

    useEffect(() => {
        if (scrollTilBunn) {
            scrollTilBunn();
        }
    }, [scrollTilBunn]);

    const options = beskjed.content.map(
        (item: { tekst: string }, index: number) => {
            const valgt = index === valgtIndex;
            return (
                <Valg key={index} valgt={valgt} aktiv={harValgt} tabIndex={-1}>
                    <button
                        onClick={() => {
                            if (!harValgt) {
                                setValgtIndex(index);
                                velg(beskjed.id, item.tekst);
                            }
                        }}
                        tabIndex={0}
                    >
                        {item.tekst}
                        {valgt && !fridaHarSvart && (
                            <Skriveindikator visIndikator={true} />
                        )}
                    </button>
                </Valg>
            );
        }
    );

    return (
        <Container kollaps={kollaps}>
            {!kollaps && (
                <MetaInfo
                    nickName={beskjed.nickName}
                    sent={beskjed.sent}
                    side='VENSTRE'
                />
            )}
            <ValgContainer>{options}</ValgContainer>
        </Container>
    );
};

export default Flervalg;
