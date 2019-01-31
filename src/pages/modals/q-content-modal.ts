import { Component } from '@angular/core';

import { Platform, NavParams, ViewController } from 'ionic-angular';
import { Question } from '../../models/qa.model';
import { AesEncryptionJs } from '../../app/encrypt/AesEncryptionJs';
import { APP_CONFIG } from '../../app/app.config'

@Component({
    templateUrl: 'q-content-modal.html'
})
export class QuestionModalContentPage {
    private questions: Question[] = [];
    private index = 1;
    private editable = false;

    constructor(
        public platform: Platform,
        public params: NavParams,
        public viewCtrl: ViewController,
        private aes256: AesEncryptionJs
    ) {
        if (params.data && params.data.q.length > 0) this.questions = this.decryptQA(params.data.q, this.aes256, APP_CONFIG.questionKey); else this.add();
        this.editable = params.data.editable;
    }

    add() {
        this.questions.push(this.newQuestion());
    }

    crypt() {
        this.viewCtrl.dismiss(this.encryptQA(this.questions, this.aes256, APP_CONFIG.questionKey));
    }

    remove(id) {
        this.questions.filter(f => {
            f.id != id;
        })
    }

    private newQuestion() {
        return new Question(this.index++, "", "");
    }

    private encryptQA(qa, encryptor, key) {
        return qa.map(e => {
            return new Question(e.id, encryptor.encrypt(key, e.text), e.answer)
        });
    }

    private decryptQA(qa, encryptor, key) {
        return qa.map(e => {
            return new Question(e.id, encryptor.decrypt(key, e.text), e.answer)
        });
    }
}