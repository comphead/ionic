import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { Items } from '../../app/providers/firebase.qa.provider'

@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html'
})
export class ItemDetailsPage {
  selectedItem: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private _items: Items) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
  }

  delete() {
    this._items.delete(this.selectedItem);
    this.navCtrl.pop();
  }

  switchActive(item) {
    this._items.switchActive(item);
  }
}
