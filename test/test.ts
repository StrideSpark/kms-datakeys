import { encryptWithKms, decryptWithKms } from '../src/index';
import * as AWS from 'aws-sdk';
import { assert } from 'chai';

AWS.config.region = process.env['AWS_DEFAULT_REGION'] = 'us-west-2';

describe('kms integration test', function () {
    it("does the thing", async function () {
        this.timeout(20000); //because megan was on a plane while testing this
        const kms = new AWS.KMS();
        const input = { secret: 'shhh' };
        const encrypted = await encryptWithKms(kms, process.env.KEY_ID, input);
        const result = await decryptWithKms<Object>(kms, encrypted.encryptedKey, encrypted.encryptedObj);
        assert.deepEqual(result, input)
    })
});
