import {Ref, ref, shallowRef} from "vue";
import {Group, Layer, NormalLayer, Root} from "../TreeStruct/LayerTree.ts";
import {Assert, ImageAssert, rect} from "./ProjectAsserts.ts";
import Psd, {NodeChild} from "@webtoon/psd";

class Project {
    protected static _instance = shallowRef<Project | null>(null)
    name: Ref<string> = ref("未命名")
    /**
     * Root在项目中不会改变
     * 名称和项目名称相同
     */
    root: Root | null = null
    /**
     * assert列表 用于代表图片，文件等
     * 列表为响应式的
     * 其中的元素应也是响应式的
     */
    assert: Ref<Ref<Assert>[]> = ref(ref([]))

    /**
     * 用于从PSD初始化一个工程 需要进行错误处理
     */
    static async initFromPsd(f: File) {
        const newProject = new Project();
        const p = Psd.parse(await f.arrayBuffer());
        const children = await this.parseChild(p.children);
        newProject.root = new Root(ref(p.name), shallowRef(children));
        newProject.assert = ref(this.getAssertFromRoot(newProject.root));
        this._instance.value = newProject;
    }

    /**
     * 从Root中提取Assert，
     */
    protected static getAssertFromRoot(root: Root) {
        return ref(findAssert(root));

        function findAssert(group: Group) {
            const assertList: Ref<Assert>[] = []
            for (const child of group.children.value) {
                if (child.type == "Normal") {
                    assertList.push((child as NormalLayer).assert)
                }
                if (child.type == "Group") {
                    assertList.push(...findAssert(child as Group));
                }
            }
            return assertList;
        }
    }

    /**
     * 使用parsePSD库提取信息转化为Root
     */
    protected static async parseChild(children: NodeChild[]): Promise<Layer[]> {
        const res: Layer[] = []
        for (const child of children) {
            if (child.type == "Group") {
                const c = this.parseChild(child.children);

                res.push(getGroup(child.name, await c));
            }
            if (child.type == "Layer") {
                const rec: rect = {
                    height: child.height,
                    left: child.left,
                    top: child.top,
                    width: child.width
                }
                res.push(getNormalLayer(child.name, await child.composite(), rec));
            }
        }
        return res;

        function getNormalLayer(name: string, buffer: Uint8ClampedArray, r: rect): NormalLayer {
            const assert = new ImageAssert(buffer, r);
            return new NormalLayer(ref(name), ref(assert))
        }

        function getGroup(name: string, children: Layer[]): Group {
            return new Group(ref(name), shallowRef(children))
        }
    }


    static get instance() {
        return this._instance
    }
}

export default Project