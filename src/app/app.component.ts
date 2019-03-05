import { Component, ViewChild } from '@angular/core';

import {Platform, MenuController, Nav, ToastController} from 'ionic-angular';
import { SettingsPage } from '../pages/settings/settings';
import { InboxListPage, OutboxListPage } from '../pages/list/list';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../app/services/auth.service';
import { Audit } from './providers/firebase.qa.provider';
import { Message } from '../models/qa.model';
import { APP_CONFIG } from './app.config';
import { auth } from 'firebase';
import { Device } from '@ionic-native/device/ngx';
import {FcmService} from "./services/fcm.service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage;
  pages: Array<{ title: string, component: any }>;
  user: firebase.User;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private auth: AuthService,
    private audit: Audit,
    private device: Device,
    private fcm: FcmService,
    private toast: ToastController
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Inbox', component: InboxListPage },
      { title: 'Outbox', component: OutboxListPage },
      { title: 'Settings', component: SettingsPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.platform.resume.subscribe((result) => {
        this.doAudit(this.user, "resume");
      });

      this.auth.afAuth.authState
        .subscribe(
          user => {
            this.user = user;
            if (user) {
              this.doAudit(user, "login");
              this.rootPage = OutboxListPage;
              sessionStorage.setItem(APP_CONFIG.sessionUser, this.auth.getEmail());
              this.notificationSetup();
            } else {
              this.rootPage = HomePage;
            }
          },
          () => {
            this.rootPage = HomePage;
          }
        );

    });
  }

  private doAudit(user, type) {
    this.audit.add(new Message({
      "email": user.email,
      "action": type,
      "timestamp": new Date().getTime(),
      "os": this.device.platform,
      "deviceId": this.device.uuid
    }));
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  login() {
    this.menu.close();
    this.auth.signOut();
    this.nav.setRoot(OutboxListPage);
  }

  logout() {
    this.menu.close();
    this.auth.signOut();
    this.nav.setRoot(HomePage);
  }

  private async presentToast(message) {
    const toast = await this.toast.create({
      message,
      duration: 3000
    });
    toast.present();
  }

  private notificationSetup() {
    this.fcm.getToken();
    this.fcm.onNotifications().subscribe(
      (msg) => {
        if (this.platform.is('ios')) {
          this.presentToast(msg.aps.alert);
        } else {
          this.presentToast(msg.body);
        }
      });
  }
}
