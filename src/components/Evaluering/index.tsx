import React, { Component } from 'react';
import { Container, Eval, Outer, Snakkeboble } from './styles';
import rating1 from '../../assets/rating-1.svg';
import rating2 from '../../assets/rating-2.svg';
import rating3 from '../../assets/rating-3.svg';
import rating4 from '../../assets/rating-4.svg';
import rating5 from '../../assets/rating-5.svg';
import MetaInfo from '../MetaInfo';
import { loadJSON } from '../../services/localStorageService';
import { Message } from '../../api/Sessions';

type EvalueringProps = {
    beskjed: Message;
    opprettEvaluering: () => void;
    evaluer: (evaluering: 1 | 2 | 3 | 4 | 5) => void;
    baseUrl: string;
    queueKey: string;
    nickName: string;
};

export type EvalueringState = {
    valgt: boolean;
    valgtSvar: 1 | 2 | 3 | 4 | 5;
};
export default class Evaluering extends Component<
    EvalueringProps,
    EvalueringState
> {
    constructor(props: EvalueringProps) {
        super(props);
        this.state = {
            valgt: !!loadJSON('svartEval'),
            valgtSvar: loadJSON('svartEval')
        };
    }

    componentDidMount(): void {
        // this.props.opprettEvaluering();
    }

    render() {
        return (
            <Outer>
                <MetaInfo
                    nickName={this.props.nickName}
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
                        evalValgt={this.state.valgt}
                        valgt={this.state.valgtSvar === 1}
                    />
                    <Eval
                        onClick={() => this.props.evaluer(2)}
                        dangerouslySetInnerHTML={{ __html: rating2 }}
                        evalValgt={this.state.valgt}
                        valgt={this.state.valgtSvar === 2}
                    />
                    <Eval
                        onClick={() => this.props.evaluer(3)}
                        dangerouslySetInnerHTML={{ __html: rating3 }}
                        evalValgt={this.state.valgt}
                        valgt={this.state.valgtSvar === 3}
                    />
                    <Eval
                        onClick={() => this.props.evaluer(4)}
                        dangerouslySetInnerHTML={{ __html: rating4 }}
                        evalValgt={this.state.valgt}
                        valgt={this.state.valgtSvar === 4}
                    />
                    <Eval
                        onClick={() => this.props.evaluer(5)}
                        dangerouslySetInnerHTML={{ __html: rating5 }}
                        evalValgt={this.state.valgt}
                        valgt={this.state.valgtSvar === 5}
                    />
                </Container>
            </Outer>
        );
    }
}
