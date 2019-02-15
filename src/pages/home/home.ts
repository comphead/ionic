import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ListPage } from '../list/list';
import { AuthService } from '../../app/services/auth.service'
import { SignupPage } from '../signup/signup'
import { NgxErrorsModule } from '@ultimate/ngxerrors';
import { MSG_CFG } from '../../app/messages.config'

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
    fb: FormBuilder
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
        error => this.loginError = error.message
      );
  }

  facebookLogin() {
    this.auth.facebookLogin(success => {
      console.log("Firebase success: " + JSON.stringify(success));
      this.navCtrl.setRoot(ListPage)
    });
  }

  loginWithGoogle() {
    this.auth.signInWithGoogle()
      .then(
        () => this.navCtrl.setRoot(HomePage),
        error => console.log(error.message)
      );
  }

  signup() {
    this.navCtrl.push(SignupPage);
  }
}

