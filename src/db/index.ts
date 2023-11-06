import Dexie, { type Table } from 'dexie';

interface Library{//词库
    id?:number;
    name:string;
    about?:string
}
interface Library_Word{
    id?:number;
    libraryid:number;
    wordid:number;
}
interface Word {//词语
    id?: number;
    word: string;
}
interface Sentence{//句子
    id?:number,
    sentence:string
}
interface Study{//学习进度
    id?:number,
    wordid:number,//词语id
    /*
    1~7 1代表初次学习，7代表已经完成记住
     */
    schedule:number,//进度
    next:number,//下次复习时间
}

export class WordsDatabase extends Dexie {
    public words!: Table<Word, number>; // id is number in this case
    public sentence!: Table<Sentence, number>;
    public stuby!: Table<Study,number>;
    public library!:Table<Library,number>;
    public library_word!:Table<Library_Word,number>;

    public constructor() {
        super("WordsDatabase");
        this.version(1).stores({
            words: "++id,word",
            sentence: "++id,sentence",
            stuby: "++id,wordid,schedule,next",
            library:"++id,name",
            library_word:"++id,libraryid,wordid"
        });
    }
}
export const DB = new WordsDatabase();

interface DBUpdate{
    /**
     * 将修改更新到数据库
     */
    update:()=>Promise<void>;
}

export class WordPrototype implements Word,DBUpdate{
    id?: number;
    word!: string;

    async update(){
        await DB.words.put({
            id:this.id,
            word:this.word
        })
    }
}
//代表一个词库
export class LibraryPrototype implements Library,DBUpdate{
    id?: number;
    name!: string;
    about?: string;

    async update(){
        await DB.library.put({
            id:this.id,
            name:this.name,
            about:this.about
        });
    }
    /**
     * 添加词语到词库
     * @returns addNew:是否添加了新的，word:这个新的对象或者是已经存在的对象
     */
    async addWord(word:string):Promise<{addNew:boolean,word:WordPrototype}>{
        let addnew = false;
        //添加词语
        let qurt =  DB.words.where("word").equals(word);
        let wordObj = await qurt.first();
        if(!wordObj){
            let addobj = {word:word};
            let wordid = await DB.words.add(addobj);
            wordObj = {id:wordid,...addobj};
        }
        
    
        //添加对应表
        let qurt2 = DB.library_word.where("wordid").equals(wordObj!.id!).and((obj)=>{return obj.libraryid==this.id});
        let library_wordObj:Library_Word | undefined = await qurt2.first();
        if(!library_wordObj){
            let addobj = {libraryid:this.id!,wordid:wordObj.id!};
            let theID = await DB.library_word.add(addobj);
            library_wordObj = {id:theID,...addobj};
            addnew = true;
        }

        Object.setPrototypeOf(wordObj,WordPrototype.prototype);
        let wordPrototype:WordPrototype = wordObj as WordPrototype;
        return {addNew:addnew,word:wordPrototype};
    }
    /**
     * 获取全部词语
     */
    async WordArray():Promise<Array<WordPrototype>>{
        let library_wordObjArray = await DB.library_word.where("libraryid").equals(this.id!).toArray();
        let words:Array<WordPrototype> = new Array();
        for(const library_wordObj of  library_wordObjArray){
            let word = await DB.words.get(library_wordObj.wordid);
            if(word){
                Object.setPrototypeOf(word,WordPrototype.prototype);
                let wordPrototype:WordPrototype = word as WordPrototype;
                words.push(wordPrototype);
            }
        }
        return words;
    }
};
//词库管理
export const LibraryManager = {
    /**
     * 创建词库
     * @returns 词库
     */
    async create(name:string,about?: string):Promise<LibraryPrototype>{
        let addobj = {name:name,about:about};
        let id = await DB.library.add(addobj);
        let obj:Library = {id:id,...addobj};
        Object.setPrototypeOf(obj,LibraryPrototype.prototype);
        return obj as LibraryPrototype;
    },
    /**
     * 全部的词库
     */
    async array():Promise<Array<LibraryPrototype>>{
        let array = await DB.library.toArray();
        for(const the of array){
            Object.setPrototypeOf(the,LibraryPrototype.prototype);
        }
        return array as Array<LibraryPrototype>;
    },
    /**
     * 获取摸个id的词库
     */
    async get(id:number):Promise<LibraryPrototype | null>{
        let theObj = await DB.library.get(id);
        if(!theObj){
            return null;
        }
        Object.setPrototypeOf(theObj,LibraryPrototype.prototype);
        return theObj as LibraryPrototype;
    }
}

// class StudyPrototype implements Study{
//     id?: number;
//     wordid!: number;
//     schedule!: number;
//     next!: number;
    
// }

//学习管理
export const StudyManager = {

};

//句子管理
export const SentenceManager = {

}




