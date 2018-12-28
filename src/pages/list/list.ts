import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/item-details';
//import { Items } from '../../mocks/providers/MailProvider'
import { Items } from '../../app/providers/firebase.qa.provider'
import { MailItem } from '../../models/qa.model';
import { NewItemPage } from '../item-details/item-new'


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  icons: string[];
  items: MailItem[];
  filteredItems: MailItem[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private _items: Items) {
    this.initializeItems();
  }

  initializeItems() {
    this._items.query().subscribe(res => {
      this.items = res;
      this.filteredItems = res;
    });
  }

  itemTapped(event, item) {
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }

  add() {
    this.navCtrl.push(NewItemPage);
  }

  //rewrite to pipe
  getItems(ev) {
    
    // set val to the value of the ev target
    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.filteredItems = this.items.filter((item) => {
        return ((item.title + '|' + item.text).toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.filteredItems = this.items;
    }
  }
}
