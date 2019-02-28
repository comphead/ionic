import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { FIREBASE_CONFIG } from './firebase.credentials';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { QuestionModalContentPage } from '../pages/modals/q-content-modal'
import { ListPage } from '../pages/list/list';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { NewItemPage } from '../pages/item-new/item-new';
import { Items, Audit, MessageProvider } from './providers/firebase.qa.provider';
import { AES256 } from '@ionic-native/aes-256/ngx';
import { AesEncryptionJs } from './encrypt/AesEncryptionJs';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { AuthService } from '../app/services/auth.service';
import { SignupPage } from '../pages/signup/signup';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { Toast } from '@ionic-native/toast/ngx';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignupPage,
    ListPage,
    ItemDetailsPage,
    NewItemPage,
    SettingsPage,
    QuestionModalContentPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    NgxErrorsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignupPage,
    ListPage,
    ItemDetailsPage,
    NewItemPage,
    SettingsPage,
    QuestionModalContentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Items,
    AES256,
    AesEncryptionJs,
    Facebook,
    GooglePlus,
    AngularFireAuth,
    AngularFirestore,
    AuthService,
    MessageProvider,
    Audit,
    Toast
  ]
})
export class AppModule { }
