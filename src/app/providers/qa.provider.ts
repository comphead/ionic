import { Injectable } from '@angular/core';

import { MailItem } from '../../models/qa.model';

import { Api } from '../services/remote.service';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';

@Injectable()
export class Items {

    constructor(public api: Api) { }

    query(params?: any): Observable<MailItem[]> {
        return of([]);//return this.api.get("items", params).;
    }

    add(item: MailItem) {
        this.api.post("add", item);
    }

    delete(item: MailItem) {
        this.api.delete("add", item);
    }

    encrypt(item: MailItem) {
        
    }

    decrypt(item: MailItem) {
        
    }
} 