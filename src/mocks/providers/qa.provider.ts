import { Injectable } from '@angular/core';

import { Message } from '../../models/qa.model';

import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';

@Injectable()
export class Items {
    items: Message[] = [...Array(7)]
    .map((_,i) => new Message({
        "text": 'Mail Text'+i,
        "title": 'Mail Title'+i,
        "timestamp": new Date().getTime(),
        "from": Math.random().toString(36).substring(7),
        "to": Math.random().toString(36).substring(7) + ";" + Math.random().toString(36).substring(7),
        "active": true
    }))

    constructor() {
    }

    query(params?: any): Observable<Message[]> {
        if (!params) {
            return of(this.items);
        }

        return of(this.items.filter((item) => {
            for (let key in params) {
                let field = item[key];
                if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
                    return item;
                } else if (field == params[key]) {
                    return item;
                }
            }
            return null;
        }));
    }

    add(item: Message) {
        this.items.push(item);
    }

    delete(item: Message) {
        this.items.splice(this.items.indexOf(item), 1);
    }

    encrypt(item: Message) {
        
    }

    decrypt(item: Message) {
        
    }
} 