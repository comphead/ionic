import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, ToastController } from 'ionic-angular';
import { SettingsPage } from '../pages/settings/settings';
import { InboxListPage, OutboxListPage } from '../pages/list/list';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../app/services/auth.service';
import { Audit, Users } from './providers/firebase.qa.provider';
import { Message } from '../models/qa.model';
import { APP_CONFIG } from './app.config';
import { Device } from '@ionic-native/device';
import { FcmService } from "./services/fcm.service";
import { firebaseConfig } from './providers/firebase.config';

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
    private toast: ToastController,
    private firebaseConfig: firebaseConfig,
    private users: Users
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
/*
      this.firebaseConfig.readKey("questionKey")
        .then((res: any) => {
          APP_CONFIG.questionKey = res
          console.log(APP_CONFIG.questionKey)
        })
        .catch((error: any) => console.log(error));
*/
      this.platform.resume.subscribe((result) => {
        this.doAudit(this.user, "resume");
      });

      this.notificationSetup();

      this.auth.afAuth.authState
        .subscribe(
          user => {
            this.user = user;
            if (user) {
              this.doAudit(user, "login");
              this.rootPage = OutboxListPage;
              sessionStorage.setItem(APP_CONFIG.sessionUser, this.auth.getEmail());
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
    let deviceId = this.device.uuid;
    let email = null;

    if (user) {
      email = user.email ? user.email : user.providerData[0].email;

      this.users.add(new Message({
        "email": email,
        "deviceId": deviceId
      }));
    }
    this.audit.add(new Message({
      "email": email,
      "action": type,
      "timestamp": new Date().getTime(),
      "deviceId": deviceId
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
