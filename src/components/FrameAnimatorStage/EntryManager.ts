import AnimateEntry from "./AnimateEntry";

/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-18 15:30:05
 */
class EntryManager {
    protected _entrys: Map<string, AnimateEntry> = new Map();
    constructor() {

    }

    get entrys() { return this._entrys }
    getEntryById(id: string) {
        return this._entrys.get(id)
    }

    addNewEntry() {
    }

    deleteEntry() {
    }

    registerEntry(layerId: string) {
        const res: AnimateEntry[] = []
        for (const entry of this._entrys) {
            if (entry[1].isRegister(layerId)) {
                res.push(entry[1]);
            }
        }
        return res;
    }

}

export default EntryManager