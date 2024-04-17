import EntryRecord from "./EntryRecord"

/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-17 08:48:58
 */
class AnimateFrameManager {
    protected entrys = new Map<string, EntryRecord>()

    findEntryById(id: string) {
        return this.entrys.get(id);
    }


}
export default AnimateFrameManager