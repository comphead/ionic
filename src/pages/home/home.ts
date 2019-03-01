import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ListPage } from '../list/list';
import { AuthService } from '../../app/services/auth.service'
import { SignupPage } from '../signup/signup'
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { MSG_CFG } from '../../app/messages.config'
import { Toast } from '@ionic-native/toast/ngx';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  loginForm: FormGroup;
  loginError: string;

  constructor(
    private navCtrl: NavController,
    private auth: AuthService,
    fb: FormBuilder,
    toast: Toast
  ) {
    this.loginForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  login() {
    let data = this.loginForm.value;

    if (!data.email) {
      return;
    }

    let credentials = {
      email: data.email,
      password: data.password
    };

    this.auth.signInWithEmail(credentials)
      .then(
        (creds) => {
          if (creds.user.emailVerified) {
            this.navCtrl.setRoot(ListPage)
          }
          else {
            creds.user.sendEmailVerification()
            this.loginError = MSG_CFG.emailNotVerified
          }
        },
        error => this.onError(error, "mailErrorLogin")
      );
  }

  facebookLogin() {
    this.auth.facebookLogin()
      .then(
        () => this.navCtrl.setRoot(HomePage),
        error => this.onError(error, "fbErrorLogin")
      );
  }

  private onError(error, details) {
    console.log(details + " :" + error.message)
          this.loginError = error.message
  }

  loginWithGoogle() {
    this.auth.signInWithGoogle()
      .then(
        () => this.navCtrl.setRoot(HomePage),
        error => this.onError(error, "googleErrorLogin")
      );
  }

  signup() {
    this.navCtrl.push(SignupPage);
  }
}

