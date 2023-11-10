import { SentencePrototype } from "../class";
import { DB } from "../dexie"

//句子管理
export default {
    /**
     * 添加句子
     */
    async add(text:string):Promise<SentencePrototype>{
        let theObj = await DB.sentence.where("sentence").equals(text).first();
        if(!theObj){
            let id = await DB.sentence.add({sentence:text});
            theObj = {id:id,sentence:text};
        }
        Object.setPrototypeOf(theObj,SentencePrototype.prototype)
        return theObj as SentencePrototype;
    },
    /**
     * 获取句子
     * @param id 句子id
     */
    async get(id:number):Promise<SentencePrototype|undefined>{
        let obj = await DB.sentence.get(id);
        if(!obj){
            return undefined;
        }
        Object.setPrototypeOf(obj,SentencePrototype.prototype)
        return obj as SentencePrototype;
    },
    /**
     * 获取全部句子
     * @param page 分页
     */
    async sentenceArray(page?:{offset:number,limit:number}):Promise<SentencePrototype[]>{
        let objArray;
        if(page){
            objArray = await DB.sentence.offset(page.offset).limit(page.limit).toArray();
        }else{
            objArray = await DB.sentence.toArray();
        }
        for(const obj of objArray){
            Object.setPrototypeOf(obj,SentencePrototype.prototype);
        }
        return objArray as SentencePrototype[];
    }
}