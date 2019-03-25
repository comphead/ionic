import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore';
import { FIREBASE_CONFIG } from './firebase.credentials';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { QuestionModalContentPage } from '../pages/modals/q-content-modal'
import { InboxListPage, OutboxListPage } from '../pages/list/list';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { NewItemPage } from '../pages/item-new/item-new';
import { Audit, MessageProvider, InboxItems, OutboxItems, Devices, Users } from './providers/firebase.qa.provider';
import { AES256 } from '@ionic-native/aes-256/ngx';
import { AesEncryptionJs } from './encrypt/AesEncryptionJs';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { AuthService } from '../app/services/auth.service';
import { SignupPage } from '../pages/signup/signup';
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { Toast } from '@ionic-native/toast/ngx';
import { FcmService } from "./services/fcm.service";
import { Firebase } from "@ionic-native/firebase";
import { Device } from '@ionic-native/device';
import { firebaseConfig } from './providers/firebase.config';
import { FirebaseConfig } from '@ionic-native/firebase-config';
import { IAP } from './providers/cordova.iap.provider';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { HttpModule } from '@angular/http'
import { Utils } from './services/utils.service';
import { Settings } from './providers/settings.provider';
import { Storage, IonicStorageModule } from '@ionic/storage';

export function provideSettings(storage: Storage) {
  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignupPage,
    InboxListPage,
    OutboxListPage,
    ItemDetailsPage,
    NewItemPage,
    SettingsPage,
    QuestionModalContentPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    NgxErrorsModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignupPage,
    InboxListPage,
    OutboxListPage,
    ItemDetailsPage,
    NewItemPage,
    SettingsPage,
    QuestionModalContentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: Settings, useFactory: provideSettings, deps: [Storage] }, 
    InAppPurchase,
    IAP,
    AES256,
    AesEncryptionJs,
    Facebook,
    GooglePlus,
    AngularFireAuth,
    AngularFirestore,
    AuthService,
    MessageProvider,
    Audit,
    Toast,
    InboxItems,
    OutboxItems,
    Firebase,
    FcmService,
    Device,
    Devices,
    firebaseConfig,
    FirebaseConfig,
    Users,
    Utils  
  ]
})
export class AppModule { }
