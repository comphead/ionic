import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Devices } from '../providers/firebase.qa.provider';
import {Firebase} from "@ionic-native/firebase";

@Injectable()
export class FcmService {

  constructor(private devices: Devices,
              private firebase: Firebase,
              private platform: Platform) {}

  async getToken() {
    let token;

    if (this.platform.is('android')) {
      token = await this.firebase.getToken();
    }

    if (this.platform.is('ios')) {
      token = await this.firebase.getToken();
      await this.firebase.grantPermission();
    }

    this.saveToken(token);
  }

  private saveToken(token) {
    if (!token) return;

    this.devices.add(token);
  }

  onNotifications() {
    return this.firebase.onNotificationOpen();
  }
}
