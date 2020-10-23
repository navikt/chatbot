import React from 'react';
import {Knapp as KnappKomponent} from './styles';

export type Properties = {
    disabled?: boolean;
    aktiv?: boolean;
    children?: React.ReactNode;
};

const Knapp = (properties: Properties) => {
    return (
        <KnappKomponent
            disabled={properties.disabled}
            type='submit'
            aktiv={properties.aktiv}
            tabIndex={0}
        >
            {properties.children}
        </KnappKomponent>
    );
};

export default Knapp;
