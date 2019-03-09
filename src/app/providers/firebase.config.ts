import { Injectable } from "@angular/core";
import { FirebaseConfig } from '@ionic-native/firebase-config'

export interface Config {
    readKey(key: string): Promise<string>
}

@Injectable()
export class firebaseConfig implements Config {

    constructor(protected config: FirebaseConfig) {
    }

    readKey(key: string) {
        return this.config.getString(key);
    }
}