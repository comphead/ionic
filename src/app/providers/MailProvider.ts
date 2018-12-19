import { Injectable } from '@angular/core';

import { MailItem } from '../../models/MailItem';

@Injectable()
export class Items {
    items: MailItem[] = [];

    defaultItem: any = {
        "title": "Mail0",
        "text": "Mail0 text!!!!!!!!!",
        "ts": new Date('July 20, 2018 00:20:18 GMT+00:00').getTime(),
        "from": "addr@addr"
    };

    constructor() {
        let items = [
            {
                "title": "Mail0",
                "text": "Mail0 text!!!!!!!!!",
                "ts": new Date('July 20, 2018 00:20:18 GMT+00:00').getTime(),
                "from": "addr@addr"
            },
            {
                "title": "Mail1",
                "text": "Mail1 text!!!!!!!!!",
                "ts": new Date('July 21, 2018 00:20:18 GMT+00:00').getTime(),
                "from": "addr1@addr1"
            },
            {
                "title": "Mail2",
                "text": "Mail2 text!!!!!!!!!",
                "ts": new Date('July 22, 2018 00:20:18 GMT+00:00').getTime(),
                "from": "addr2@addr2"
            },
            {
                "title": "Mail3",
                "text": "Mail3 text!!!!!!!!!",
                "ts": new Date('July 23, 2018 00:20:18 GMT+00:00').getTime(),
                "from": "addr3@addr3"
            },
            {
                "title": "Mail4",
                "text": "Mail4 text!!!!!!!!!",
                "ts": new Date('July 24, 2018 00:20:18 GMT+00:00').getTime(),
                "from": "addr4@addr4"
            },
            {
                "title": "Mail5",
                "text": "Mail5 text!!!!!!!!!",
                "ts": new Date('July 25, 2018 00:20:18 GMT+00:00').getTime(),
                "from": "addr5@addr5"
            },
            {
                "title": "Mail6",
                "text": "Mail6 text!!!!!!!!!",
                "ts": new Date('July 26, 2018 00:20:18 GMT+00:00').getTime(),
                "from": "addr6@addr6"
            },
            {
                "title": "Mail7",
                "text": "Mail7 text!!!!!!!!!",
                "ts": new Date('July 27, 2018 00:20:18 GMT+00:00').getTime(),
                "from": "addr7@addr7"
            },
            {
                "title": "Mail8",
                "text": "Mail8 text!!!!!!!!!",
                "ts": new Date('July 28, 2018 00:20:18 GMT+00:00').getTime(),
                "from": "addr8@addr8"
            },
            {
                "title": "Mail9",
                "text": "Mail9 text!!!!!!!!!",
                "ts": new Date('July 29, 2018 00:20:18 GMT+00:00').getTime(),
                "from": "addr9@addr9"
            },

        ];

        for (let item of items) {
            this.add(new MailItem(item));
        }
    }

    query(params?: any) {
        if (!params) {
            return this.items;
        }

        return this.items.filter((item) => {
            for (let key in params) {
                let field = item[key];
                if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
                    return item;
                } else if (field == params[key]) {
                    return item;
                }
            }
            return null;
        });
    }

    add(item: MailItem) {
        this.items.push(item);
    }

    delete(item: MailItem) {
        this.items.splice(this.items.indexOf(item), 1);
    }
} 