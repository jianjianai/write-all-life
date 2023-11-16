import Dexie, { type Table } from 'dexie';

export interface Library {//词库
    id?: number;
    name: string;
    about?: string
}
export interface Library_Word {
    id?: number;
    libraryid: number;
    wordid: number;
}
export interface Word {//词语
    id?: number;
    word: string;
}
export interface Sentence {//句子
    id?: number,
    sentence: string
}
export interface Study {//学习进度
    id?: number,
    wordid: number,//词语id
    /*
0~10 0代表重来没有学习过，不知道会不会 1代表初次学习，7代表已经完成记住
     */
    schedule: number,//进度
    next: number,//下次复习时间
}

export class WordsDatabase extends Dexie {
    public words!: Table<Word, number>; // id is number in this case
    public sentence!: Table<Sentence, number>;
    public stuby!: Table<Study, number>;
    public library!: Table<Library, number>;
    public library_word!: Table<Library_Word, number>;

    public constructor() {
        super("WordsDatabase");
        this.version(2).stores({
            words: "++id,word",
            sentence: "++id,sentence",
            stuby: "++id,wordid,schedule,next,[wordid+schedule]",
            library: "++id,name",
            library_word: "++id,libraryid,wordid,[libraryid+wordid]"
        });
    }
}
export const DB = new WordsDatabase();