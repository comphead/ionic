import { Injectable } from '@angular/core';

import { Message } from '../../models/qa.model';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { APP_CONFIG } from '../app.config'
import { firestore } from 'firebase';

export interface Provider<T> {
  //listRef: AngularFireList<T>
  messageCollectionRef: AngularFirestoreCollection<T>
  query(params?: any)
  add(item: T)
  update(item: T)
  delete(item: T)
}

@Injectable()
export class MessageProvider implements Provider<Message> {
  messageCollectionRef: AngularFirestoreCollection<Message> = this.store.collection<Message>(APP_CONFIG.dbs.msgs);
  dbName: string = APP_CONFIG.dbs.msgs;

  constructor(protected db: AngularFireDatabase, protected store: AngularFirestore) {
  }

  query(params?: any): Observable<Message> {
    return this.messageCollectionRef
      .snapshotChanges().pipe(
        map(
          changes => {
            return changes.map(c => ({
              key: c.payload.doc.id, ...c.payload.doc.data()
            }))
          })
      );
  }

  add(item: Message) {
    //{... item} as firestore doesn't support custom  types
    this.messageCollectionRef.add({ ...item });
  }

  delete(item: Message) {
    this.messageCollectionRef.doc(item.key).delete();
  }

  update(item: Message) {
    this.messageCollectionRef.doc(item.key).update(item);
  }

  filter(filterFn): Observable<Message> {
    return this.store.collection<Message>(this.dbName, filterFn)
      .snapshotChanges().pipe(
        map(
          changes => {
            return changes.map(c => ({
              key: c.payload.doc.id, ...c.payload.doc.data()
            }))
          })
      );
  }
}

@Injectable()
export class InboxItems extends MessageProvider {
  query(params?: any): Observable<Message> {
    return this.filter(ref =>
      ref
        .where('delivered', '==', "true")
        .where('toList', 'array-contains', sessionStorage.getItem(APP_CONFIG.sessionUser)));
  }
}

@Injectable()
export class OutboxItems extends MessageProvider {
  query(params?: any): Observable<Message> {
    return this.filter(ref =>
      ref.where('from', '==', sessionStorage.getItem(APP_CONFIG.sessionUser)));
  }
}

@Injectable()
export class Audit extends MessageProvider {
  dbName: string = APP_CONFIG.dbs.audit;
  messageCollectionRef: AngularFirestoreCollection<Message> = this.store.collection<Message>(APP_CONFIG.dbs.audit);
}

@Injectable()
export class Devices extends MessageProvider {
  messageCollectionRef: AngularFirestoreCollection<Message> = this.store.collection<Message>(APP_CONFIG.dbs.devices);
  dbName: string = APP_CONFIG.dbs.devices;

  add(message: Message) {

    let devices = firestore().collection(this.dbName);

    devices.where('deviceId', '==', message.deviceId)
      .where('pushToken', '==', message.pushToken)
      .get().then(function (querySnapshot) {
        if (querySnapshot.docs.length == 0) {
          devices.add({...message})
            .then(() => { console.log(`Added device ${message}`) })
            .catch((err) => { `Failed to add device ${message}, err ${err}` });
        }
      });
  }
}

@Injectable()
export class Users extends MessageProvider {
  messageCollectionRef: AngularFirestoreCollection<Message> = this.store.collection<Message>(APP_CONFIG.dbs.users);
  dbName: string = APP_CONFIG.dbs.users;

  add(message: Message) {
    message.lastSeen = new Date().getTime();
    let users = firestore().collection(this.dbName);

    users.where('email', '==', message.email).get().then(function (querySnapshot) {
      if (querySnapshot.docs.length == 0) {
        message.lastNotified = 0;
        message.deviceIds = [];
        if (message.deviceId) message.deviceIds.push(message.deviceId);
        users.add({...message})
          .then(() => { console.log(`Added user ${message}`) })
          .catch((err) => { `Failed to add user ${message}, err ${err}` });
      } else {
        querySnapshot.docs.map(function (doc) {
          if (message.deviceId) {
            if (doc.get("deviceIds").indexOf(message.deviceId) < 0) {
              message.deviceIds = doc.get("deviceIds");
              message.deviceIds.push(message.deviceId);
            }
          }
          if (!message.deviceId) message.deviceId = doc.get("deviceId");
          users.doc(doc.id).update({ ...message })
            .then(() => { console.log(`Updated user ${message}`) })
            .catch((err) => { `Failed to update user ${message}, err ${err}` });
        });
      }
    })
  }
}
