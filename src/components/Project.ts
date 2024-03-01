import {Ref, ref, shallowRef} from "vue";
import {Assert} from "./ProjectAsserts.ts";
import {AbstractLayer, GroupLayer, layerType, NormalLayer, RootLayer} from "./LayerTree.ts";

class Project {
    protected static _instance = shallowRef<Project | null>(null)
    name = "未命名"
    asserts: Ref<Assert>[] = []
    psdRoot: RootLayer | null = null;

    protected constructor() {}

    static initFromLayerRoot(root: RootLayer) {
        const assertCollector:Ref<Assert>[] = [];
        for (const child of root.children) {
            findAssert(child)
        }
        function findAssert(layer: AbstractLayer) {
            if (layer.type == layerType.Group) {
                const g = layer as GroupLayer;
                for (const child of g.children) {
                    findAssert(child);
                }
            }
            if (layer.type == layerType.Normal) {
                assertCollector.push((layer as NormalLayer).assert);
            }
        }

        const p = new Project();
        p.psdRoot = root;
        p.asserts = assertCollector;
    }

    static get instance() {
        return this._instance
    }
}