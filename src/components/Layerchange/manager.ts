import { Entry } from "./Entry.ts";
import {ref} from 'vue'

class layerChangeManager {
  public _entrys = ref<Entry[]>([])

    addNewEntry(entry: Entry) {
      this._entrys.value.push(entry)
    }

    deleteEntry(entry: Entry) {
        this._entrys.value = this._entrys.value.filter(e => e !== entry)
    }
        // 未测试加减条目
    
    public _selectedEntry: string[]= []
    
    public test=ref("test") 
  }
  export default new layerChangeManager()