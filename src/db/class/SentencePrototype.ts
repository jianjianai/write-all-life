import type { DBUpdate } from ".";
import { DB, type Sentence } from "../dexie";

export default class SentencePrototype implements Sentence,DBUpdate{
    id!: number;
    sentence!: string;

    async update(){
        await DB.sentence.put({id:this.id,sentence:this.sentence});
    }

    async remove(){
        await DB.sentence.delete(this.id);
    }

}