import { Injectable } from '@angular/core';

import { Message } from '../../models/qa.model';

import { Observable } from 'rxjs';
import { of, concat, merge } from 'rxjs';
import { map, flatMap, concatAll } from 'rxjs/operators'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { APP_CONFIG } from '../app.config'

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
    //listRef: AngularFireList<Message> = null;
    messageCollectionRef: AngularFirestoreCollection<Message>;

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
        this.messageCollectionRef.doc(item.id).delete();
    }

    update(item: Message) {
        this.messageCollectionRef.doc(item.id).update(item);
    }
}

@Injectable()
export class Items extends MessageProvider {
    //listRef: AngularFireList<Message> = this.db.list<Message>(APP_CONFIG.dbs.msgs);
    messageCollectionRef: AngularFirestoreCollection<Message> = this.store.collection<Message>(APP_CONFIG.dbs.msgs);

    query(params?: any): Observable<Message> {
        var q1 = this.filter(ref =>
            ref.where('from', '==', sessionStorage.getItem(APP_CONFIG.sessionUser)));

        var q2 = this.filter(ref =>
            ref.where('toList', 'array-contains', sessionStorage.getItem(APP_CONFIG.sessionUser)));

        return merge(
            q2,q1
        );
    }

    private filter(filterFn): Observable<Message> {
        return this.store.collection<Message>(APP_CONFIG.dbs.msgs, filterFn)
            .snapshotChanges().pipe(
                map(
                    changes => {
                        return changes.map(c => ({
                            key: c.payload.doc.id, ...c.payload.doc.data()
                        }))
                    })
            );
    }

    switchActive(item: Message) {
        item.active = !item.active;
        this.update(item);
    }
}

@Injectable()
export class Audit extends MessageProvider {
    messageCollectionRef: AngularFirestoreCollection<Message> = this.store.collection<Message>(APP_CONFIG.dbs.audit);
} 