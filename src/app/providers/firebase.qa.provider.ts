import { Injectable } from '@angular/core';

import { Message } from '../../models/qa.model';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { APP_CONFIG } from '../app.config'

export interface Provider<T> {
    listRef: AngularFireList<T>
    query(params?: any)
    add(item: T)
    update(item: T)
    delete(item: T)
}

@Injectable()
export class MessageProvider implements Provider<Message> {
    listRef: AngularFireList<Message> = null;

    constructor(protected db: AngularFireDatabase) {
    }

    query(params?: any): Observable<Message[]> {
        return this.listRef
            .snapshotChanges().pipe(
                map(
                    changes => {
                        return changes.map(c => ({
                            key: c.payload.key, ...c.payload.val()
                        }))
                    })
            );
    }

    add(item: Message) {
        this.listRef.push(item);
    }

    delete(item: Message) {
        this.listRef.remove(item.key);
    }

    update(item: Message) {
        this.listRef.update(item.key, item);
    }
}

@Injectable()
export class Items extends MessageProvider {
    listRef: AngularFireList<Message> = this.db.list<Message>(APP_CONFIG.dbs.msgs, ref =>
        ref.orderByChild('from').equalTo(sessionStorage.getItem(APP_CONFIG.sessionUser))
    );

    switchActive(item: Message) {
        item.active = !item.active;
        this.update(item);
    }
}

@Injectable()
export class Audit extends MessageProvider {
    listRef: AngularFireList<Message> = this.db.list<Message>(APP_CONFIG.dbs.audit);
} 