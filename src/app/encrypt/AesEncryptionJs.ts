import CryptoJS from 'crypto-js'
import { Injectable } from '@angular/core';

@Injectable()
export class AesEncryptionJs {
    encrypt(key: string, data: string) {
        return CryptoJS.AES.encrypt(data, key).toString();
    }

    decrypt(key: string, data: string) {
        return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
    }

    test() {
        var string = 'Lorem ipsum dolor sit amet, ...';
        var password = 'password';
        var encrypted = CryptoJS.AES.encrypt(string, password);
        console.log(encrypted.toString());
        var decrypted = CryptoJS.AES.decrypt(encrypted.toString(), password);
        console.log(decrypted.toString(CryptoJS.enc.Utf8));
    }
}