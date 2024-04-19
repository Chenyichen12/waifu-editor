import { instanceApp } from "../../MainStage/StageApp";
import AnimateEntry, { aroundKey } from "./AnimateEntry";

/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-18 15:30:05
 */
class EntryManager {
    protected _entrys: AnimateEntry[] = []
    constructor() {

    }

    get entrys() { return this._entrys }
    getEntryById(id: string) {
        return this._entrys.find((v) => {
            return v.id == id;
        })
    }

    addNewEntry(entry: AnimateEntry) {
        this._entrys.push(entry);
    }

    deleteEntry() {
    }

    registerEntry(layerId: string) {
        const res: AnimateEntry[] = []
        for (const entry of this._entrys) {
            if (entry.isRegister(layerId)) {
                res.push(entry)
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

    getEntryKeyValue() {
        return this._entrys.map((v) => {
            return v.currentValue;
        })
    }
    setKeyValue(num: number[]) {
        if (num.length != this._entrys.length) {
            return;
        }

        const before = this.getEntryKeyValue();
        this._entrys.forEach((v, i) => {
            v.currentValue = num[i];
        })
        const after = this.getEntryKeyValue();
        if (instanceApp.value != null) {
            instanceApp.value.movementRecord.upDateRecord(before, after);
        }
    }
}

export default EntryManager