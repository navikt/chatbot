import React, { Component } from 'react';
import { Container, Eval, Snakkeboble } from './styles';
import rating1 from '../../assets/rating-1.svg';
import rating2 from '../../assets/rating-2.svg';
import rating3 from '../../assets/rating-5.svg';
import rating4 from '../../assets/rating-4.svg';
import rating5 from '../../assets/rating-5.svg';
import MetaInfo from '../MetaInfo';
import { Beskjed } from '../Kommunikasjon';

type EvalueringProps = {
    beskjed: Beskjed;
    evaluer: (evaluering: 1 | 2 | 3 | 4 | 5) => void;
};

export default class Evaluering extends Component<EvalueringProps, {}> {
    render() {
        return (
            <div>
                <MetaInfo
                    nickName='Chatbot Frida'
                    sent={this.props.beskjed.sent}
                    side='VENSTRE'
                />
                <Snakkeboble>
                    Håper du fikk svar på det du lurte på. Takk for praten.
                </Snakkeboble>
                <Snakkeboble>
                    Jeg vil bli bedre. Evaluer gjerne din chatopplevelse med
                    meg.
                </Snakkeboble>
                <Container>
                    <Eval
                        onClick={() => this.props.evaluer(1)}
                        dangerouslySetInnerHTML={{ __html: rating1 }}
                    />
                    <Eval
                        onClick={() => this.props.evaluer(2)}
                        dangerouslySetInnerHTML={{ __html: rating2 }}
                    />
                    <Eval
                        onClick={() => this.props.evaluer(3)}
                        dangerouslySetInnerHTML={{ __html: rating3 }}
                    />
                    <Eval
                        onClick={() => this.props.evaluer(4)}
                        dangerouslySetInnerHTML={{ __html: rating4 }}
                    />
                    <Eval
                        onClick={() => this.props.evaluer(5)}
                        dangerouslySetInnerHTML={{ __html: rating5 }}
                    />
                </Container>
            </div>
        );
    }
}
