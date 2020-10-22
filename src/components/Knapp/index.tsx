import React from 'react';
import {KnappElement} from './styles';

export type KnappProps = {
    disabled?: boolean;
    aktiv?: boolean;
    prosent?: number;
    children?: React.ReactNode;
};

export default function Knapp(props: KnappProps) {
    return (
        <KnappElement
            disabled={props.disabled}
            type='submit'
            aktiv={props.aktiv}
            tabIndex={0}
            prosent={props.prosent}
        >
            {props.children}
        </KnappElement>
    );
}
