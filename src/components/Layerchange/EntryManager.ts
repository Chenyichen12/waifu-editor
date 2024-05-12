/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-05-06 08:47:21
 */
import { Entry } from "./Entry";


interface EntryOption {
    name: string,
    id: string,
    isExpand?: boolean
    isVisible?: boolean
}
class TreeEntryManager {
    children: Entry[];

    constructor() {
        this.children = [];
    }

    addGroup(newEntryOption: EntryOption, childrenId: string[]) {
        const newEntry: Entry = {
            name: newEntryOption.name,
            id: newEntryOption.id,
            isVisible: newEntryOption.isVisible ?? true,
            isSelect: true,
            listExpand: newEntryOption.isExpand ?? true,
            type: "refator",

            children: [],
            parent: undefined
        }
        let firstIndex = 0;
        let firstFlag = true;
        const findId = (entrys: Entry[]) => {
            const res: Entry[] = []

            for (let i = 0; i < entrys.length; i++) {
                const en = entrys[i];
                if (childrenId.includes(en.id)) {
                    res.push(en);
                    if (firstFlag) {
                        firstIndex = i;
                        firstFlag = false;
                    }
                }
                if (en.children.length != 0) {
                    res.push(...findId(en.children));
                }
            }
            if (res.length = 0) {
                return [];
            }

            let which = true;
            let p: Entry | undefined = undefined;
            for (const r of res) {
                if (r.parent != undefined) {
                    r.parent.children = r.parent.children.filter((v) => v.id !== r.id);
                    r.parent = newEntry;
                    which = false;
                } else {
                    this.children = this.children.filter((v) => v.id !== r.id);
                    r.parent = newEntry;
                    p = r.parent;
                    which = true;
                }
            }
            if (which) {
                this.children.splice(firstIndex, 0, newEntry);
            } else {
                p!.children.splice(firstIndex, 0, newEntry);
                newEntry.parent = p!;
            }

            for (const r of res) {
                newEntry.children.push(r);
            }

            return res;
        }

        findId(this.children);
    }
}

export default TreeEntryManager