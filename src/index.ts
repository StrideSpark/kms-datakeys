import * as AWS from 'aws-sdk';
import * as crypto from 'crypto';
import {KMS} from 'aws-sdk';

const algorithm = 'aes-256-cbc';

function encrypt(password: any, obj: any): Buffer {
    const json = JSON.stringify(obj);
    const cipher = crypto.createCipher(algorithm, password);
    return Buffer.concat([cipher.update(new Buffer(json, 'utf8')), cipher.final()]);
}

export interface EncryptionResult {
    encryptedKey: Buffer,
    encryptedObj: Buffer
}

export async function encryptWithKms<T>(kms: AWS.KMS, KeyId: string, obj: T): Promise<EncryptionResult> {
    // generate data key
    const dataKeyResult = await kms.generateDataKey({
        KeyId,
        KeySpec: 'AES_256',
    }).promise();

    // use data key to encrypt
    const encryptedObj = encrypt(dataKeyResult.Plaintext.toString('base64'), obj);

    return {
        encryptedKey: dataKeyResult.CiphertextBlob,
        encryptedObj
    }
}

function decrypt(key: any, encryptedObj: Buffer) {
    const decipher = crypto.createDecipher(algorithm, key)
    const dec = Buffer.concat([decipher.update(encryptedObj), decipher.final()]);
    return JSON.parse(dec.toString('utf8'));
}

export async function decryptWithKms<T>(kms: AWS.KMS, encrypted_key: Buffer, encrypted_obj: Buffer): Promise<T> {
    // use kms to decrypt data key
    const dataKey = await kms.decrypt({ CiphertextBlob: encrypted_key }).promise();

    // use decrypted key to decrypt creds
    return decrypt(dataKey.Plaintext.toString('base64'), encrypted_obj);
}
