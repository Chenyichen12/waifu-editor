import AnimateEntry, { aroundKey } from "./AnimateEntry";

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

    addNewEntry(entry: AnimateEntry) {
        this._entrys.set(entry.id, entry);
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

    initDefault() {
        const entry1 = new AnimateEntry({
            name: "左眼",
            around: aroundKey.one2one
        })
        const entry2 = new AnimateEntry({
            name: "右眼",
            around: aroundKey.one2one
        })

        const entry3 = new AnimateEntry({
            name: "测试",
            around: aroundKey.zero2one
        })
        this.addNewEntry(entry1);
        this.addNewEntry(entry2);
        this.addNewEntry(entry3);
    }
}

export default EntryManager