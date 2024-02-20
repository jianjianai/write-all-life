import { DB, type Study } from "../dexie";
import { WordPrototype, type DBUpdate } from ".";
import { WordsManager } from "..";

/**
 * 不同的学习进度，下次学习等待时间
 */
const nextStudyWaitTime: { [key: number]: number } = {
    1: 1 * 24 * 60 * 60 * 1000,//一天
    2: 2 * 24 * 60 * 60 * 1000,//两天
    3: 4 * 24 * 60 * 60 * 1000,//四天
    4: 7 * 24 * 60 * 60 * 1000,//七天
    5: 15 * 24 * 60 * 60 * 1000,//15天
    6: 30 * 24 * 60 * 60 * 1000,//30天
    7: 60 * 24 * 60 * 60 * 1000,//60天
    8: 120 * 24 * 60 * 60 * 1000,//120天
    9: 365 * 24 * 60 * 60 * 1000,//365天
    10: 3650 * 24 * 60 * 60 * 1000,//3650天
}
export default class StudyPrototype implements Study, DBUpdate {
    constructor() { throw new Error("不可使用构造方法构造！"); }
    /**
     * 如果为undefined则为从未学习过的新进度
     */
    id?: number;
    wordid!: number;
    /**
    0~10 0代表重来没有学习过，不知道会不会 1代表初次学习，7代表已经完成记住
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
        this.next = new Date().getTime()-1;
    }
    /**
     * 进入下一次学习
     */
    setNextlearn() {
        let now = new Date().getTime();
        if(this.schedule==0){//如果第一次看就会那肯定就会，直接下月再复习
            this.next = now-1;
            this.schedule = 6;
        }
        //计算下次学习时间
        while(true){
            if(this.schedule >= 10){
                //如果已经是大于10年的状态，就继续10年
                this.next = now + nextStudyWaitTime[10] - (12* 60 * 60 * 1000);//当前时间加上下次学习时间减去12个小时。
                break;
            }

            //计算下个复习周期
            let time = nextStudyWaitTime[this.schedule];
            this.schedule = this.schedule + 1;
            this.next = this.next + time;
            if(this.next > now){
                this.next = now + time - (12* 60 * 60 * 1000);//当前时间加上下次学习时间减去12个小时。
                break;
            }
        }
    }

}
