import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Devices } from '../providers/firebase.qa.provider';
import { Firebase } from "@ionic-native/firebase";
import { Device } from '@ionic-native/device';
import { Message } from '../../models/qa.model';

@Injectable()
export class FcmService {

  constructor(private devices: Devices,
              private firebase: Firebase,
              private platform: Platform,
              private device: Device) { }

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

    this.devices.add(new Message({
      "deviceId": this.device.uuid,
      "os": this.device.platform,
      "pushToken": token,
      "timestamp": new Date().getTime()
    }));
  }

  onNotifications() {
    return this.firebase.onNotificationOpen();
  }
}
