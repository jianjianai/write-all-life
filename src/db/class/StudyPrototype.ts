import { DB, type Study } from "../dexie";
import { WordPrototype, type DBUpdate } from ".";
import { WordsManager } from "..";

/**
 * 不同的学习进度，下次学习等待时间
 */
const nextStudyWaitTime: { [key: number]: number } = {
    1: 1 * 24 * 60 * 60 * 1000,//一天
    2: 2 * 24 * 60 * 60 * 1000,//两天
    3: 4 * 24 * 60 * 60 * 1000,
    4: 7 * 24 * 60 * 60 * 1000,
    5: 15 * 24 * 60 * 60 * 1000,
    6: 30 * 24 * 60 * 60 * 1000,
    7: 60 * 24 * 60 * 60 * 1000,
    8: 120 * 24 * 60 * 60 * 1000,
    9: 365 * 24 * 60 * 60 * 1000,
    10: 3650 * 24 * 60 * 60 * 1000,
}
export default class StudyPrototype implements Study, DBUpdate {
    constructor() { throw new Error("不可使用构造方法构造！"); }
    /**
     * 如果为undefined则为从未学习过的新进度
     */
    id?: number;
    wordid!: number;
    /**
    1~10 1代表初次学习，7代表已经完成记住
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

    async getWord(): Promise<WordPrototype> {
        return (await WordsManager.get(this.wordid))!;
    }

    /**
     * 重置学习进度
     */
    setRelearn() {
        this.schedule = 1;
    }
    /**
     * 进入下一次学习
     */
    setNextlearn() {
        let time = nextStudyWaitTime[this.schedule];
        if (this.schedule < 10) {
            this.schedule = this.schedule + 1;
        }
        this.next = Date.now()+time-(12* 60 * 60 * 1000);//当前时间加上下次学习时间减去12个小时。
    }

}
