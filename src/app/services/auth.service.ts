import { Injectable } from '@angular/core';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { APP_CONFIG } from '../../app/app.config';
import AuthProvider = firebase.auth.AuthProvider;

@Injectable()
export class AuthService {
    private user: firebase.User;

    constructor(public fb: Facebook, private googlePlus: GooglePlus, public afAuth: AngularFireAuth) {
        afAuth.authState.subscribe(user => {
            this.user = user;
        });
    }

    facebookLogin() {
        console.log('Sign in with Facebook');
        return this.fb.login(['email'])
            .then(response => {
                const facebookCredential = firebase.auth.FacebookAuthProvider
                    .credential(response.authResponse.accessToken);

                return this.afAuth.auth.signInAndRetrieveDataWithCredential(facebookCredential);
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
        return this.user ?
            (this.user.email ? this.user.email : this.user.providerData[0].email) : "";
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
        return this.googlePlus.login({
            'webClientId': APP_CONFIG.googleWebClientId
        }).then(
            response => {
                const googleCredentials = firebase.auth.GoogleAuthProvider
                    .credential(response.idToken);

                return this.afAuth.auth.signInAndRetrieveDataWithCredential(googleCredentials);
            }
        );
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

    private oauthSignInPopup(provider: AuthProvider): Promise<void> {
        return this.afAuth.auth.signInWithPopup(provider)
            .then(() => {
                this.afAuth.auth.getRedirectResult().then(result => {
                    let user = result.user;
                }).catch(function (error) {
                    console.log(error);
                });
            });
    }

}