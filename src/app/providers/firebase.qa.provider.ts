import { Injectable } from '@angular/core';

import { Message } from '../../models/qa.model';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class Items {
    private dbName: string = 'qaMsg';
    private listRef = this.db.list<Message>(this.dbName);

    constructor(private db: AngularFireDatabase) { }

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

    switchActive(item: Message) {
        item.active = !item.active;
        this.update(item);
    }

    encrypt(item: Message) {

    }

    decrypt(item: Message) {

    }
} 