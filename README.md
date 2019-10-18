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

## Typescript
`index.d.ts` kan finnes i pakkerot. Pakken støtter ikke Typescript "out of the box".
Denne genereres via `npm run generate:types`, og vil også bli automatisk kjørt før `build`.
