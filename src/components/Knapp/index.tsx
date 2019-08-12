import React, { Component } from 'react';
import { KnappElement } from './styles';

export default class Knapp extends Component {
    render() {
        return <KnappElement type='submit'>{this.props.children}</KnappElement>;
    }
}
