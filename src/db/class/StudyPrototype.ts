import { DB, type Study } from "../dexie";
import { WordPrototype, type DBUpdate } from ".";
import { WordsManager } from "..";

export default class StudyPrototype implements Study, DBUpdate {
    constructor() { throw new Error("不可使用构造方法构造！"); }
    /**
     * 如果为undefined则为从未学习过的新进度
     */
    id?: number;
    wordid!: number;
    /**
    1~7 1代表初次学习，7代表已经完成记住
    */
    schedule!: number;
    next!: number;

    async update() {
        if (!this.id) {
            let id = await DB.stuby.add({ wordid: this.wordid, schedule: this.schedule, next: this.next });
            this.id = id;
            return;
        }
        await DB.stuby.put({ id: this.id, wordid: this.wordid, schedule: this.schedule, next: this.next });
    };

    async getWord():Promise<WordPrototype>{
        return (await WordsManager.get(this.wordid))!;
    }

}
