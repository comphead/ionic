import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/item-details';

import { Items } from '../../mocks/providers/MailProvider'
import { MailItem } from '../../models/MailItem';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  icons: string[];
  items: Array<MailItem>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.items = new Items().query();
  }

  itemTapped(event, item) {
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }
}
