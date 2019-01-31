export class Message {

    constructor(fields: any) {
      // Quick and dirty extend/assign fields to this model
      for (const f in fields) {
        // @ts-ignore
        this[f] = fields[f];
      }
    }
  
  }
  
  export interface Message {
    [prop: string]: any;
  }
  
  export interface Question {
    id: number,
    text: string,
    answer: string
  }

  export class Question {
    constructor(id, text, answer) {
      this.id = id;
      this.text = text;
      this.answer = answer;
    }
  }