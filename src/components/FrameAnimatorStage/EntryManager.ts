import AnimateEntry from "./AnimateEntry";

/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-18 15:30:05
 */
class EntryManager {
    protected _entrys: AnimateEntry[] = [];
    constructor() {

    }

    get entrys() { return this._entrys }
    getEntryById(id: string) {
        return this._entrys.find((v) => {
            return v.id == id;
        })
    }

    addNewEntry() {
    }

    deleteEntry() {
    }


}

export default EntryManager