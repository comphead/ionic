import { AES256 } from '@ionic-native/aes-256/ngx';

export class Aes256Encryption {

    private secureKey: string;
    private secureIV: string;

    constructor(private key: string, private aes256: AES256) {
        this.generateSecureKeyAndIV(this.key);
    }

    private async generateSecureKeyAndIV(key: string) {
        this.secureKey = await this.aes256.generateSecureKey("123123123"); // Returns a 32 bytes string
        this.secureIV = await this.aes256.generateSecureIV(key); // Returns a 16 bytes string
    }

    encrypt(data: string) {
        return this.aes256.encrypt(this.secureKey, this.secureIV, data)
            .then(res => res)
            .catch((error: any) => console.error(error));
    }

    decrypt(data: string) {
        return this.aes256.decrypt(this.secureKey, this.secureIV, data)
        .then(res => res)
        .catch((error: any) => console.error(error));
    }
}