import { encryptWithKms, decryptWithKms } from './index';
import * as AWS from 'aws-sdk';
const test = require('tape');

AWS.config.region = process.env['AWS_DEFAULT_REGION'] = 'us-west-2';

test('kms integration test', async (t: any) => {
    t.plan(1);


    const kms = new AWS.KMS();
    const input = { secret: 'shhh' };
    const encrypted = await encryptWithKms(kms, process.env.KEY_ID, input);
    const result = await decryptWithKms<Object>(kms, encrypted.encryptedKey, encrypted.encryptedObj);

    t.deepEqual(result, input);
});
