/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-03-30 11:34:21
 * PIXIApp类
 */
import { Application, Graphics } from "pixi.js";
import StageLayer from "./LayerBase/StageLayer";
import { ref, shallowRef } from "vue";
import Project from "../components/Project/Project";
import { Group, LayerType, NormalLayer, Root } from "../components/Project/LayerStruct";
import StageLayerContainer from "./LayerBase/StageLayerContainer";
import StageEventHandler, { SelectedEventHandler } from "./EventHandler/StageEventHandler";
import EditMeshMode from "./EditMeshMode/EditMeshMode";
import MorpherContainer from "./Morpher/MorpherContainer";
import Morpher from "./Morpher/Morpher";
import AnimateRecordManager from "./movementRecord";


//在生命周期中仅能存在一个instaceApp，更换时候需要销毁原先的
const instanceApp = shallowRef<StageApp | null>(null)

class StageApp extends Application {
    /**App承载的Dom元素 */
    protected stageDom
    get containerDom() { return this.stageDom }

    /**Stage的缩放 */
    appScale = ref(1)

    /**事件处理器 */
    eventHandler: StageEventHandler = new SelectedEventHandler(this);

    layerContainer: StageLayerContainer = new StageLayerContainer([]);

    morpherContainer: MorpherContainer

    movementRecord: AnimateRecordManager

    constructor(dom: HTMLDivElement) {
        super();
        this.stageDom = dom;
        this.stage.interactive = true;
        if (instanceApp.value != null) {
            instanceApp.value.destroy();
            let child = this.stageDom.lastElementChild;
            while (child != undefined) {
                this.stageDom.removeChild(child);
                child = this.stageDom.lastElementChild;
            }
        }
        this.morpherContainer = new MorpherContainer([]);
        this.movementRecord = new AnimateRecordManager(this);
        instanceApp.value = this;
    }

    /**从project中提取信息构建App */
    async initFromProject(project: Project) {
        await this.init({
            background: "#4BC1F0",
            resizeTo: this.stageDom,
            preference: "webgl",
        });
        this.stageDom.appendChild(this.canvas);

        const projectRect = project.root.bound
        this.addBg(projectRect);
        this.addSprite(project);

        const scale = this.calculateScale(project);
        this.appScale.value = scale;
        const scaleAfterX = projectRect.width * scale
        const scaleAfterY = projectRect.height * scale
        this.stage.scale.set(scale)
        this.stage.position.set(this.screen.width / 2 - scaleAfterX / 2, this.screen.height / 2 - scaleAfterY / 2)

        this.canvas.onmousedown = (e) => {
            this.eventHandler.handleMouseDownEvent(e);
        }
        this.canvas.onmouseup = (e) => {
            this.eventHandler.handleMouseUpEvent(e);
        }
        this.canvas.onmousemove = (e) => {
            this.eventHandler.handleMouseMoveEvent(e);
        }
        this.canvas.onwheel = (e) => {
            this.eventHandler.handleWheelEvent(e);
        }
    }

    /**
     * 添加StageLayer并指定zIndex，注意mesh层在最上面
     * @param project 
     */
    protected addSprite(project: Project) {
        const proRoot = project.root
        const layers: StageLayer[] = []
        addLayer(proRoot);
        this.layerContainer = new StageLayerContainer(layers);
        const { mesh, texture } = this.layerContainer.getMeshAndTexture();
        this.stage.addChild(texture);
        this.stage.addChild(mesh);

        this.stage.addChild(this.morpherContainer);
        /**
         * 递归添加到childLayer
         * @param group 
         */
        function addLayer(group: Root | Group) {
            for (const child of group.children.value) {
                if (child.type === LayerType.NormalLayer) {
                    const normal = child as NormalLayer;
                    const item = Project.instance.value!.assetList.get(normal.assetId);
                    if (item == null) continue;
                    const gra = new StageLayer({ texture: item, isShow: child.isVisible, layerId: normal.layerId });
                    layers.push(gra);
                } else {
                    const gro = child as Group;
                    addLayer(gro);
                }
            }
        }
    }



    /**
     * 添加背景
     * @param rect 长宽 
     */
    protected addBg(rect: { width: number, height: number }) {
        const bg = new Graphics();
        bg.rect(0, 0, rect.width, rect.height);
        bg.fill(0xECECEC)
        this.stage.addChild(bg)
    }
    /**
    * 计算scale，以适应视图大小和位置
    */
    protected calculateScale(project: Project) {
        const projectRect = project.root.bound
        const scaleX = this.screen.width / projectRect.width;
        const scaleY = this.screen.height / projectRect.height;
        const scale = scaleX > scaleY ? scaleY : scaleX;
        return scale;
    }


    createEditMode() {
        let select: StageLayer = this.layerContainer.showedLayer[0];
        for (const layer of this.layerContainer.selectedLayer) {
            select = layer;
            break;
        }
        return new EditMeshMode(this, select);
    }

    findLayerById(id: string): StageLayer | Morpher | undefined {
        const layer = this.layerContainer.getLayerById(id);
        const morpher = this.morpherContainer.getMorpherById(id);
        if (layer != undefined) {
            return layer;
        }
        if (morpher != undefined) {
            return morpher
        }
    }

    findLayerWithNoParent() {
        return [...this.morpherContainer.findMorpherWithNoParent(), ...this.layerContainer.findLayerWithNoParent()]
    }

}

export default StageApp
export { instanceApp }