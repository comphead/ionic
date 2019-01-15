import { ModalController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { Message } from '../../models/qa.model';
import { Items } from '../../app/providers/firebase.qa.provider';
import { QuestionModalContentPage } from '../../pages/modals/q-content-modal'

@Component({
    templateUrl: 'item-new.html'
})
export class NewItemPage {
    private item: FormGroup;
    private emailPattern = /^(([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)(\s*;\s*|\s*$))*$/
    private q = [];

    constructor(public navCtrl: NavController, private formBuilder: FormBuilder, private modalCtrl: ModalController, private items: Items) {
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
        const modal = this.modalCtrl.create(QuestionModalContentPage, this.q);
        modal.present();
        modal.onDidDismiss(data => {
            this.q = data ? data : [];
        })
    }

    save() {
        var i = new Message({
            "text": this.item.value.text,
            "title": this.item.value.subject,
            "timestamp": new Date().getTime(),
            "from": Math.random().toString(36).substring(7),
            "to": this.item.value.email,
            "active": true,
            "questions": this.q,
        });
        this.items.add(i);
        this.navCtrl.pop();
    }
}