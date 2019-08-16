import React, { Component } from 'react';
import { KnappElement } from './styles';

export type KnappProps = {
    disabled: boolean;
    aktiv: boolean;
};

export default class Knapp extends Component<KnappProps, {}> {
    render() {
        return (
            <KnappElement
                disabled={this.props.disabled}
                type='submit'
                aktiv={this.props.aktiv}
                tabIndex={0}
            >
                {this.props.children}
            </KnappElement>
        );
    }
}
