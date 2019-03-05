import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';
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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage;
  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private auth: AuthService,
    private audit: Audit
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
    });

    this.auth.afAuth.authState
      .subscribe(
        user => {
          if (user) {
            this.doAudit(user);
            this.rootPage = InboxListPage;
            sessionStorage.setItem(APP_CONFIG.sessionUser, this.auth.getEmail());
          } else {
            this.rootPage = HomePage;
          }
        },
        () => {
          this.rootPage = HomePage;
        }
      );
  }

  private doAudit(user) {
    this.audit.add(new Message({
      "email": user.email,
      "action": "login",
      "timestamp": new Date().getTime()
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
    this.nav.setRoot(HomePage);
  }

  logout() {
    this.menu.close();
    this.auth.signOut();
    this.nav.setRoot(InboxListPage);
  }
}
