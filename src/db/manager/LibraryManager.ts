import { LibraryPrototype } from "../class";
import { DB, type Library } from "../dexie";

//词库管理
export default {
    /**
     * 创建词库
     * @returns 词库
     */
    async create(name: string, about?: string): Promise<LibraryPrototype> {
        let addobj = { name: name, about: about };
        let id = await DB.library.add(addobj);
        let obj: Library = { id: id, ...addobj };
        Object.setPrototypeOf(obj, LibraryPrototype.prototype);
        return obj as LibraryPrototype;
    },
    /**
     * 全部的词库
     */
    async array(): Promise<Array<LibraryPrototype>> {
        let array = await DB.library.toArray();
        for (const the of array) {
            Object.setPrototypeOf(the, LibraryPrototype.prototype);
        }
        return array as Array<LibraryPrototype>;
    },
    /**
     * 获取摸个id的词库
     */
    async get(id: number): Promise<LibraryPrototype | null> {
        let theObj = await DB.library.get(id);
        if (!theObj) {
            return null;
        }
        Object.setPrototypeOf(theObj, LibraryPrototype.prototype);
        return theObj as LibraryPrototype;
    }
};
