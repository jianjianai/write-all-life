import { DB, type Word } from "../dexie";
import { type DBUpdate } from ".";


export default class WordPrototype implements Word, DBUpdate {
    constructor() { throw new Error("不可使用构造方法构造！"); }

    id!: number;
    word!: string;

    async update() {
        await DB.words.put({
            id: this.id,
            word: this.word
        });
    }
}
