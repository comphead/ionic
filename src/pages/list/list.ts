import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/item-details';
//import { Items } from '../../mocks/providers/MailProvider'
import { Items } from '../../app/providers/firebase.qa.provider'
import { Message } from '../../models/qa.model';
import { NewItemPage } from '../item-new/item-new'


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  icons: string[];
  items: Message[];
  filteredItems: Message[];
  searching = false;

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

  remove(item) {
    this._items.delete(item);  
  }

  switchActive(item) {
    this._items.switchActive(item);
  }

  //rewrite to pipe
  onSearch(ev) { 
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
