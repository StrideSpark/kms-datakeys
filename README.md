# kms-datakeys
wrapper for using kms data keys (es6 and typescript friendly)

## installation

```bash
npm install kms-datakeys --save
```

## usage

```typescript
import { encryptWithKms, decryptWithKms } from 'kms-datakeys';

const encrypted = await encryptWithKms(kms, 'SOME KEY ID', input);
const result = await decryptWithKms<Object>(kms, encrypted.encryptedKey, encrypted.encryptedObj);
```
