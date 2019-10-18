# Chatbot Frida
## Installasjon
```sh
npm i @navikt/nav-chatbot
```

## Bruk
```javascript
import NAVChatBot from '@navikt/nav-chatbot';

<NAVChatBot
    customerKey='xxxx'
    queueKey='XXXX'
    configId='xxxx-xxxx-xxxx-xxxx-xxxx'
    evaluationMessage=''
/>
```
> NAVChatBot har følgende props:
```typescript
interface ConnectionConfig {
    queueKey: string;
    customerKey: string;
    configId: string;
    evaluationMessage?: string;
}
```
