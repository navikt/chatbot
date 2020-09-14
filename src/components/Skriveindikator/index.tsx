import React from 'react';
import { Container, Indikator, IndikatorDot } from './styles';

type Props = {
    visIndikator: boolean;
};

export const Skriveindikator = ({ visIndikator }: Props) => {
    return visIndikator ? (
        <Container>
            <Indikator>
                <IndikatorDot />
                <IndikatorDot />
                <IndikatorDot />
            </Indikator>
        </Container>
    ) : null;
};

export default Skriveindikator;
