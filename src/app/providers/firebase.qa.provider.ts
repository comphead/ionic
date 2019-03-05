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
    messageCollectionRef: AngularFirestoreCollection<Message> = this.store.collection<Message>(APP_CONFIG.dbs.msgs);

    constructor(protected db: AngularFireDatabase, protected store: AngularFirestore) {
    }

    protected filter(filterFn): Observable<Message> {
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
    messageCollectionRef: AngularFirestoreCollection<Message> = this.store.collection<Message>(APP_CONFIG.dbs.audit);
} 