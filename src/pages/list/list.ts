import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/item-details';
//import { Items } from '../../mocks/providers/MailProvider'
import { InboxItems, OutboxItems, MessageProvider } from '../../app/providers/firebase.qa.provider'
import { Message } from '../../models/qa.model';
import { NewItemPage } from '../item-new/item-new'


class BaseListPage {
  icons: string[];
  items: Message[] = [];
  filteredItems: Message[] = [];
  searching = false;
  title: String;
  readonly: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, protected _items: MessageProvider) {
    this.initializeItems();
  }

  initializeItems() {
    this._items.query().subscribe(res => {
      res.forEach(element => {
        this.items.push(element);
        this.filteredItems.push(element);
      });
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
    this.items.splice(this.items.indexOf(item), 1);
    this.filteredItems.splice(this.filteredItems.indexOf(item), 1);
    this._items.delete(item);
  }

  switchActive(item) {
    //this._items.switchActive(item);
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

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class InboxListPage extends BaseListPage {
  title = "Inbox"
  readonly = true
  constructor(public navCtrl: NavController, public navParams: NavParams, private i: InboxItems) {
    super(navCtrl, navParams, i);
  }
}

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class OutboxListPage extends BaseListPage {
  title = "Outbox"
  readonly = false
  constructor(public navCtrl: NavController, public navParams: NavParams, private i: OutboxItems) {
    super(navCtrl, navParams, i);
  }
}