import { ModalController, NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Message } from '../../models/qa.model';
import { Question } from '../../models/qa.model';
import { OutboxItems } from '../../app/providers/firebase.qa.provider';
import { QuestionModalContentPage } from '../../pages/modals/q-content-modal'
//import { Aes256Encryption } from '../../app/encrypt/Aes256Encryption'
//import { AES256 } from '@ionic-native/aes-256/ngx';
import { AesEncryptionJs } from '../../app/encrypt/AesEncryptionJs';
import { APP_CONFIG } from '../../app/app.config'

@Component({
    templateUrl: 'item-new.html'
})
export class NewItemPage {
    private item: FormGroup;
    private emailPattern = /^(([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)(\s*;\s*|\s*$))*$/
    private q = Array<Question>();

    constructor(public navCtrl: NavController,
        private formBuilder: FormBuilder,
        private modalCtrl: ModalController,
        private items: OutboxItems,
        private aes256: AesEncryptionJs) {
        this.item = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
            subject: ['', Validators.required],
            text: ['']
        });
    }

    cancel() {
        this.navCtrl.pop();
    }

    questionPopup() {
        const modal = this.modalCtrl.create(QuestionModalContentPage, { editable: true, q: this.q });
        modal.present();
        modal.onDidDismiss(data => {
            this.q = data ? data : (this.q ? this.q : []);
        })
    }

    save() {
        var textKey = this.q.map(q => q.answer).join();
        console.log("Encrypted with " + textKey)
        var i = new Message({
            "text": this.aes256.encrypt(textKey, this.item.value.text),
            "title": this.item.value.subject,
            "timestamp": new Date().getTime(),
            "from": sessionStorage.getItem(APP_CONFIG.sessionUser),
            "to": this.item.value.email,
            "toList": this.item.value.email.split(";"),
            "active": true,
            "delivered": false,
            "questions": this.q.map(e => {
                return {... new Question(e.id, e.text, "")}
            }),
        });
        this.items.add(i);
        this.navCtrl.pop();
    }
    /*
        private transformQA(qa) {
            return Promise.all(qa.map(e => {
                var encryptor = new Aes256Encryption(e.answer, this.aes256);
                return ({ "question": encryptor.encrypt(e.question), "answer": "" });
            }));
        }
    */
}