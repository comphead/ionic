import { Injectable } from '@angular/core';

import { MailItem } from '../../models/qa.model';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { AngularFireDatabase } from 'angularfire2/database';


@Injectable()
export class Items {
    private dbName: string = 'qaMsg';
    private listRef = this.db.list<MailItem>(this.dbName);

    constructor(private db: AngularFireDatabase) { }

    query(params?: any): Observable<MailItem[]> {
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

    add(item: MailItem) {
        this.listRef.push(item);
    }

    delete(item: MailItem) {
        this.listRef.remove(item.key);
    }

    encrypt(item: MailItem) {

    }

    decrypt(item: MailItem) {

    }
} 