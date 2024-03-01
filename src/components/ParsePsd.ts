import Psd, {NodeChild} from "@webtoon/psd"
import {AbstractLayer, GroupLayer, NormalLayer, RootLayer} from "./LayerTree.ts"
import {Assert} from "./ProjectAsserts.ts";
import {ref} from "vue";
async function ParsePsd(f: File) {
    const buffer = await f.arrayBuffer();
    const model = Psd.parse(buffer)
    const rootChild = await getChildren(model.children)
    const root = new RootLayer(model.name,{width: model.width,height: model.height,top: 0,left: 0},rootChild)

}

async function getChildren(children: NodeChild[]):Promise<AbstractLayer[]>{
    const res: AbstractLayer[] = [];
    for (let child of children) {
        const name = child.name;
        if(child.type == "Group"){
            const c = await getChildren(child.children);
            res.push(new GroupLayer(name,c))
        }
        if(child.type == "Layer"){
            const data = await child.composite()
            const assert:Assert = {
                pixMap: data,
                r:{
                    width: child.width,
                    height: child.height,
                    top: child.top,
                    left: child.left
                }
            }
            res.push(new NormalLayer(name, ref(assert)));
        }
    }
    return res;
}

export default ParsePsd