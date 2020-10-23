import React from 'react';
import {Boks, Indikator, IndikatorPrikk} from './styles';

type Properties = {visIndikator: boolean};
const Skriveindikator = ({visIndikator}: Properties) => {
    if (!visIndikator) {
        return null;
    }

    return (
        <Boks>
            <Indikator>
                <IndikatorPrikk />
                <IndikatorPrikk />
                <IndikatorPrikk />
            </Indikator>
        </Boks>
    );
};

export default Skriveindikator;
