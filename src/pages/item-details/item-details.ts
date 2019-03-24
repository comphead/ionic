import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { MessageProvider } from '../../app/providers/firebase.qa.provider'
import { QuestionModalContentPage } from '../../pages/modals/q-content-modal'
import { AesEncryptionJs } from '../../app/encrypt/AesEncryptionJs';
import { MSG_CFG } from '../../app/messages.config'
import { Utils } from '../../app/services/utils.service';


@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html'
})
export class ItemDetailsPage {
  selectedItem: any;
  key: string;
  text: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private _items: MessageProvider,
    private modalCtrl: ModalController,
    private aes256: AesEncryptionJs,
    private utils: Utils
  ) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.text = this.selectedItem.text;
  }

  delete() {
    this._items.delete(this.selectedItem);
    this.navCtrl.pop();
  }

  switchActive(item) {
    //this._items.switchActive(item);
  }

  questionPopup() {
    const modal = this.modalCtrl.create(QuestionModalContentPage, { editable: false, q: this.selectedItem.questions });
    modal.present();
    modal.onDidDismiss(data => {
      var q = data ? data : [];
      var textKey = q.map(q => q.answer).join();
      var decrypted = this.aes256.decrypt(textKey, this.selectedItem.text)

      if (this.selectedItem.text && !decrypted) this.utils.presentToast(MSG_CFG.decryptNotPossible)
      else this.utils.presentToast(MSG_CFG.decryptOk);

      this.text = decrypted ? decrypted : this.selectedItem.text
    })
  }
}
