import { LibraryManager } from ".";
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
    //获取正在学习中的，全部学习进度
    async getStudyingArray(offset:number,limit:number):Promise<Array<StudyPrototype>>{
        let objArray = await DB.stuby.offset(offset).limit(limit).toArray();
        for (const the of objArray) {
            Object.setPrototypeOf(the, StudyPrototype.prototype);
        }
        return objArray as Array<StudyPrototype>;
    },
    //获取指定词库还没学习的新进度
    async newStudyArray(library: LibraryPrototype) {
        let library_wordObjArray = await DB.library_word.where("libraryid").equals(library.id!).toArray();
        let wordObjIdArray = library_wordObjArray.map((the) => { return the.wordid });

        //表里有记录的
        let wordObjArray = await DB.stuby.where("wordid").anyOf(wordObjIdArray).toArray();
        //表里没记录的ID
        let wordIdNewArray = wordObjIdArray.filter(wordid => {
            return wordObjArray.every(wordObj => {
                return wordObj.wordid != wordid
            })
        })
        let wordArray: StudyPrototype[] = [];
        for (const wordObj of wordObjArray) {
            if(wordObj.schedule>1){
                continue;
            }
            Object.setPrototypeOf(wordObj, StudyPrototype.prototype);
            wordArray.push(wordObj as StudyPrototype)
        }
        for(const id of wordIdNewArray){
            const theObj = { wordid: id, schedule: 0, next: 0 };
            Object.setPrototypeOf(theObj, StudyPrototype.prototype);
            wordArray.push(theObj as StudyPrototype)
        }
        return wordArray;
    },
    //设置用户正在学习的词库
    async setStudyingLibrary(library: LibraryPrototype) {
        localStorage.setItem("StudyingLibrary", library.id.toString());
    },
    /** 
     * 获取用户正在学习的词库
     * @returns null 用户没有正在学习的词库
    */
    async getStudyingLibrary(): Promise<LibraryPrototype | null | undefined> {
        let studying = localStorage.getItem("StudyingLibrary");
        if (!studying) {
            return undefined;
        }
        return await LibraryManager.get(Number(studying));
    },
    /**
     * 全部句子的数量
     */
    async count(){
        return await DB.stuby.count();
    }
};
