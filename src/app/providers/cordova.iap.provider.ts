import { Injectable } from '@angular/core';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Utils } from '../services/utils.service';
import { APP_CONFIG } from '../app.config';

@Injectable()
export class IAP {
    productId: string;

    constructor(
        private iap: InAppPurchase,
        private http: Http,
        private utils: Utils
    ) {}

    products(id) {
        return this.utils.isApp() ? this.iap.getProducts([id]) : new Promise((resolve) => resolve([]))
    }

    // create the subscription
    subscribeMembership(id) {
        // we have to get products before we can buy
        return this.products(id).then(products => {
            // after we get product, buy it
            return this.iap.subscribe(id)
        })
    }

    // restore in app purchase (required)
    restoreMembership(id) {
        this.productId = id;
        this.iap.restorePurchases().then(result => {

            // loop through purchases to find the one we are looking for
            for (var i = 0; i < result.length; ++i) {
                if (result[i].productId == this.productId) {
                    console.log('Purchase found! Do something...', result)
                    return;
                }
            }
        })
            .catch(err => {
                console.log(err)
            })
    }

    checkStatus(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.iap.getReceipt()
                .then(receipt => {
                    console.log('encoded', JSON.stringify(receipt))
                    return receipt
                })
                .then(receiptData => {
                    // next, validate the encoded receipt with Apple, and get back the human readable format
                    this.validateReceipt(receiptData).then(receipt => {
                        console.log('validate receipt response', JSON.stringify(receipt))
                        //resolve(receipt)
                        resolve(true)
                    })
                })
                .catch(err => {
                    reject(err)
                    console.log(err)
                })
        })
    }

    validateReceipt(receiptData) {
        return new Promise((resolve) => {
            if (!this.utils.platform.is('ios')) resolve(receiptData)

            let headers = new Headers({ 'Content-Type': 'application/json' });
            let options = new RequestOptions({ headers: headers });

            let data = {
                'password': APP_CONFIG.iTunesIAPKey, // the shared secret key for your in app purchase https://stackoverflow.com/questions/5022296/generate-shared-secret-key-in-itunes-connect-for-in-app-purchase
                'receipt-data': receiptData
            }

            this.http.post(APP_CONFIG.iTunesReceiptCheckUrl, data, options)
                .subscribe(response => {
                    let receipt = JSON.parse(response['_body']).receipt
                    resolve(receipt)
                    // purchases can be found at receipt.in_app <Array>
                    // will need to loop through them and get most recent, then work with expiration date
                },
                    error => {
                        // probably a bad url or 404
                        console.log(error);
                    })
        })
    }

    sendReceiptToServer(receipt) {
        return new Promise((resolve) => {
            console.log('sendReceiptToServer', receipt)
        })
    }
}