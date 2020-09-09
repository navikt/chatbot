import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import { ThemeProvider } from 'styled-components';
import ChatContainer from './components/ChatContainer';
import tema from './tema/tema';
import { SurveyQuestion } from './components/Evaluering/surveyFields';

export type AnalyticsCallback = (event: string, data: any) => void;

export type ConnectionConfig = {
    queueKey: string;
    customerKey: string;
    configId: string;
    label?: string;
    analyticsCallback?: AnalyticsCallback;
    analyticsSurvey?: SurveyQuestion[];
};

export const Chat = (props: ConnectionConfig) => (
    <ThemeProvider theme={tema}>
        <ChatContainer {...props} />
    </ThemeProvider>
);

export default Chat;
