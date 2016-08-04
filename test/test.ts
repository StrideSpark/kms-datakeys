import { encryptWithKms, decryptWithKms } from '../index';
import * as AWS from 'aws-sdk';
import { assert } from 'chai';

AWS.config.region = process.env['AWS_DEFAULT_REGION'] = 'us-west-2';

describe('kms integration test', function() {
    it("does the thing", function(done) {
        const kms = new AWS.KMS();
        const input = { secret: 'shhh' };
        encryptWithKms(kms, process.env.KEY_ID, input)
            .then(encrypted => decryptWithKms<Object>(kms, encrypted.encryptedKey, encrypted.encryptedObj))
            .then(result => assert.deepEqual(result, input))
            .then(() => done())
            .catch(err => {
                console.error("This is likely failing because you have not set the env var KEY_ID. Go to AWS --> IAM --> get the key id for credstash-test");
                done(err)
            });
    })
});
