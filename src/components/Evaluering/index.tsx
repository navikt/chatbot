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
    evaluer: (evaluering: number) => void;
    baseUrl: string;
    queueKey: string;
    nickName: string;
};

export type EvalueringState = {
    valgt: boolean;
    valgtSvar: number;
};
export default class Evaluering extends Component<
    EvalueringProps,
    EvalueringState
> {
    ratings = [rating1, rating2, rating3, rating4, rating5];
    constructor(props: EvalueringProps) {
        super(props);
        this.state = {
            valgt: !!loadJSON('svartEval'),
            valgtSvar: loadJSON('svartEval')
        };
    }

    render() {
        const evalueringer = [];
        for (let i = 1; i <= 5; i++) {
            evalueringer.push(
                <Eval
                    onClick={() => this.props.evaluer(i)}
                    dangerouslySetInnerHTML={{ __html: this.ratings[i - 1] }}
                    evalValgt={this.state.valgt}
                    valgt={this.state.valgtSvar === i}
                    aria-label={`Valgmulighet ${i}: Evaluering ${i} av 5`}
                    tabIndex={0}
                    key={i}
                />
            );
        }
        return (
            <Outer>
                <MetaInfo
                    nickName={this.props.nickName}
                    sent={this.props.beskjed.sent}
                    side='VENSTRE'
                />
                <Snakkeboble
                    aria-label={`${this.props.nickName} sa:`}
                    tabIndex={0}
                >
                    Håper du fikk svar på det du lurte på. Takk for praten.
                </Snakkeboble>
                <Snakkeboble tabIndex={0}>
                    Jeg vil bli bedre. Evaluer gjerne din chatopplevelse med
                    meg.
                </Snakkeboble>
                <Container
                    aria-label={`${
                        this.props.nickName
                    } har sendt deg en evaluering med 5 valgmuligheter.`}
                >
                    {evalueringer}
                </Container>
            </Outer>
        );
    }
}
