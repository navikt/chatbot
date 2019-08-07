import React, { Component } from 'react';
import styled from 'styled-components';
import tema from '../tema/tema';

const Interaksjon = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;
const Chatlog = styled.div`
    height: 100%;
    overflow-y: scroll;
`;
const Tekstomrade = styled.div`
    margin-top: auto;
    display: flex;
    border-top: 1px solid ${tema.farger.tekstfelt};
    height: 20%;
`;
const Tekstfelt = styled.textarea`
    width: 80%;
    border: none;
`;
const Test = styled.div``;

export default class Interaksjonsvindu extends Component {
    render() {
        return (
            <Interaksjon>
                <Chatlog>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                    <h2>Test</h2>
                </Chatlog>
                <Tekstomrade>
                    <Tekstfelt placeholder={'Skriv spørsmålet ditt'} />
                    <Test>
                        <button>Send</button>
                    </Test>
                </Tekstomrade>
            </Interaksjon>
        );
    }
}
