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
            >
                {this.props.children}
            </KnappElement>
        );
    }
}
