import React from 'react';
import {Container, Indikator, IndikatorDot} from './styles';

type Props = {
    visIndikator: boolean;
};

export default function Skriveindikator({visIndikator}: Props) {
    return visIndikator ? (
        <Container>
            <Indikator>
                <IndikatorDot />
                <IndikatorDot />
                <IndikatorDot />
            </Indikator>
        </Container>
    ) : null;
}
