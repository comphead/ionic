import { Injectable } from '@angular/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FIREBASE_CONFIG } from '../../app/firebase.credentials';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import AuthProvider = firebase.auth.AuthProvider;


@Injectable()
export class AuthService {
    private user: firebase.User;

    constructor(public fb: Facebook, public googlePlus: GooglePlus, public afAuth: AngularFireAuth) {
        afAuth.authState.subscribe(user => {
            this.user = user;
        });
    }

    facebookLogin(callback): Promise<any> {
        return this.fb.login(['email'])
            .then(response => {
                firebase.initializeApp(FIREBASE_CONFIG)
                const facebookCredential = firebase.auth.FacebookAuthProvider
                    .credential(response.authResponse.accessToken);

                firebase.auth().signInWithCredential(facebookCredential)
                    .then(success => {
                        callback(success);
                    });

            }).catch((error) => { console.log(error) });
    }

    signInWithEmail(credentials) {
        console.log('Sign in with email');
        return this.afAuth.auth.signInWithEmailAndPassword(credentials.email,
            credentials.password);
    }

    signOut(): Promise<void> {
        return this.afAuth.auth.signOut();
    }

    getEmail() {
        return this.user && this.user.email;
    }

    get authenticated(): boolean {
        return this.user !== null;
    }

    signUp(credentials) {
        return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
    }

    signInWithGoogle() {
        console.log('Sign in with google');
        return this.oauthSignIn(new firebase.auth.GoogleAuthProvider());
    }

    private oauthSignIn(provider: AuthProvider) {

        return this.afAuth.auth.signInWithRedirect(provider)
            .then(() => {
                this.afAuth.auth.getRedirectResult().then(result => {
                    // This gives you a Google Access Token.
                    // You can use it to access the Google API.
                    // The signed-in user info.
                    let user = result.user;
                }).catch(function (error) {
                    // Handle Errors here.
                    alert(error.message);
                });
            });
    }

}