import { WordPrototype } from "../class";
import { DB } from "../dexie"

export default {
    /**
     * 通过单词id获取单词
     * @returns 如果找到则返回，没找到则返回undefined
     */
    async get(id:number):Promise<WordPrototype | undefined>{
        let theObj = await DB.words.get(id);
        if(!theObj){
            return undefined;
        }
        Object.setPrototypeOf(theObj,WordPrototype.prototype);
        return theObj as WordPrototype;
    }
}