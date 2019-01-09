import { Injectable } from '@angular/core';

import { Message } from '../../models/qa.model';

import { Api } from '../services/remote.service';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';

@Injectable()
export class Items {

    constructor(public api: Api) { }

    query(params?: any): Observable<Message[]> {
        return of([]);//return this.api.get("items", params).;
    }

    add(item: Message) {
        this.api.post("add", item);
    }

    delete(item: Message) {
        this.api.delete("add", item);
    }

    encrypt(item: Message) {
        
    }

    decrypt(item: Message) {
        
    }
} 