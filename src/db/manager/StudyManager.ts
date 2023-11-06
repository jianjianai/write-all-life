import { LibraryPrototype, StudyPrototype, WordPrototype } from "../class";
import { DB } from "../dexie";

//学习管理
export default {
    //获取某单词的学习进度
    async getByWord(word: WordPrototype): Promise<StudyPrototype> {
        let theObj = await DB.stuby.where("wordid").equals(word.id!).first();
        if (!theObj) {
            theObj = { wordid: word.id!, schedule: 1, next: 0 };
        }
        Object.setPrototypeOf(theObj, StudyPrototype.prototype);
        let study = theObj as StudyPrototype;
        return study;

    },
    //获取全部需要复习的学习进度
    async needReviewArray(time: Date): Promise<Array<StudyPrototype>> {
        let objArray = await DB.stuby.where("next").below(Number(time)).toArray();
        for (const the of objArray) {
            Object.setPrototypeOf(the, StudyPrototype.prototype);
        }
        return objArray as Array<StudyPrototype>;
    },
    //获取指定词库还没学习的新进度
    async newStudyArray(library: LibraryPrototype) {
        let wordPromiseArray = (await library.wordArray()).map((word) => { return this.getByWord(word); });
        let wordArray: StudyPrototype[] = [];
        for (const p of wordPromiseArray) {
            wordArray.push(await p);
        }
        return wordArray.filter((word) => { return (!word.id); });
    }
};
