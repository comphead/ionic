import { Component } from '@angular/core';

import { Platform, NavParams, ViewController } from 'ionic-angular';

@Component({
    templateUrl: 'q-content-modal.html' 
})
export class QuestionModalContentPage {
    emptyQuestion = {"question": "", "answer": ""}
    questions = [];
  
    constructor(
      public platform: Platform,
      public params: NavParams,
      public viewCtrl: ViewController
    ) {
        this.questions = params.data.length > 0 ? params.data : [Object.assign({}, this.emptyQuestion)]; 
    }

    add() {
        this.questions.push(Object.assign({}, this.emptyQuestion));
    } 

    crypt() {
        this.viewCtrl.dismiss(this.questions);
    }
}