import { type DBUpdate ,WordPrototype} from ".";
import { DB, type Library, type Library_Word } from "../dexie";


//代表一个词库

export default class LibraryPrototype implements Library, DBUpdate {
    constructor() { throw new Error("不可使用构造方法构造！"); }

    id!: number;
    name!: string;
    about?: string;

    async update() {
        await DB.library.put({
            id: this.id,
            name: this.name,
            about: this.about
        });
    }
    /**
     * 添加词语到词库
     * @returns addNew:是否添加了新的，word:这个新的对象或者是已经存在的对象
     */
    async addWord(word: string): Promise<{ addNew: boolean; word: WordPrototype; }> {
        let addnew = false;
        //添加词语
        let qurt = DB.words.where("word").equals(word);
        let wordObj = await qurt.first();
        if (!wordObj) {
            let addobj = { word: word };
            let wordid = await DB.words.add(addobj);
            wordObj = { id: wordid, ...addobj };
        }


        //添加对应表
        let qurt2 = DB.library_word.where("wordid").equals(wordObj!.id!).and((obj) => { return obj.libraryid == this.id; });
        let library_wordObj: Library_Word | undefined = await qurt2.first();
        if (!library_wordObj) {
            let addobj = { libraryid: this.id!, wordid: wordObj.id! };
            let theID = await DB.library_word.add(addobj);
            library_wordObj = { id: theID, ...addobj };
            addnew = true;
        }

        Object.setPrototypeOf(wordObj, WordPrototype.prototype);
        let wordPrototype: WordPrototype = wordObj as WordPrototype;
        return { addNew: addnew, word: wordPrototype };
    }
    /**
     * 获取全部词语
     */
    async wordArray(): Promise<Array<WordPrototype>> {
        let library_wordObjArray = await DB.library_word.where("libraryid").equals(this.id!).toArray();
        let words: Array<WordPrototype> = new Array();
        for (const library_wordObj of library_wordObjArray) {
            let word = await DB.words.get(library_wordObj.wordid);
            if (word) {
                Object.setPrototypeOf(word, WordPrototype.prototype);
                let wordPrototype: WordPrototype = word as WordPrototype;
                words.push(wordPrototype);
            }
        }
        return words;
    }
}
