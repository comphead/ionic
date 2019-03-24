import { isDevMode, Injectable } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';

@Injectable()
export class Utils {
    constructor(
        public platform: Platform,
        private toast: ToastController
    ) { }

    isApp(): boolean {
        return (!document.URL.startsWith('http') || document.URL.startsWith('http://localhost:8080') || isDevMode());
    }

    async presentToast(message) {
        const toast = await this.toast.create({
            message,
            duration: 3000
        });
        toast.present();
    }
}
