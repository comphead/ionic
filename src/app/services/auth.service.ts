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

    facebookLogin() {
        console.log('Sign in with Facebook');
        return this.fb.login(['email'])
            .then(response => {
                //firebase.initializeApp(FIREBASE_CONFIG)
                const facebookCredential = firebase.auth.FacebookAuthProvider
                    .credential(response.authResponse.accessToken);

                return this.afAuth.auth.signInWithCredential(facebookCredential);
            });
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
        return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password)
            .then(res => {
                res.user.sendEmailVerification()
            });
    }

    signInWithGoogle() {
        console.log('Sign in with google');
        return this.oauthSignIn(new firebase.auth.GoogleAuthProvider());
    }

    private oauthSignIn(provider: AuthProvider) {
        return this.afAuth.auth.signInWithRedirect(provider)
            .then(() => {
                this.afAuth.auth.getRedirectResult().then(result => {
                    let user = result.user;
                }).catch(function (error) {
                    console.log(error);
                });
            });
    }

}