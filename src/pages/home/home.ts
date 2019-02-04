import firebase from 'firebase';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { ListPage } from '../list/list';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FIREBASE_CONFIG } from '../../app/firebase.credentials';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public fb: Facebook) {

  }

  facebookLogin(): Promise<any> {
    return this.fb.login(['email'])
      .then(response => {
        firebase.initializeApp(FIREBASE_CONFIG)
        const facebookCredential = firebase.auth.FacebookAuthProvider
          .credential(response.authResponse.accessToken);

        firebase.auth().signInWithCredential(facebookCredential)
          .then(success => {
            console.log("Firebase success: " + JSON.stringify(success));
            this.navCtrl.push(ListPage);
          });

      }).catch((error) => { console.log(error) });
  }
}
