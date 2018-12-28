import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { MailItem } from '../../models/qa.model';
import { Items } from '../../app/providers/firebase.qa.provider';

@Component({
    template: `
    <form [formGroup]="item" (ngSubmit)="logForm()">
      <ion-item>
        <ion-label>Title</ion-label>
        <ion-input type="text" formControlName="title"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label>Text</ion-label>
        <ion-textarea formControlName="text"></ion-textarea>
      </ion-item>
      <button ion-button type="submit" [disabled]="!item.valid">Submit</button>
    </form>
  `
})
export class NewItemPage {
    private item: FormGroup;

    constructor(public navCtrl: NavController, private formBuilder: FormBuilder, private items: Items) {
        this.item = this.formBuilder.group({
            title: ['', Validators.required],
            text: [''],
        });
    }
    logForm() {
        var i = new MailItem({
            "text": this.item.value.text,
            "title": this.item.value.title,
            "timestamp": new Date().getTime(),
            "from": Math.random().toString(36).substring(7),
            "to": Math.random().toString(36).substring(7) + ";" + Math.random().toString(36).substring(7),
            "active": true
        });
        this.items.add(i);

        this.navCtrl.pop();
    }
}