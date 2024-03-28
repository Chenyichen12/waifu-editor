import { Application, DestroyOptions, Graphics, Matrix, RendererDestroyOptions } from "pixi.js";
import StageLayer from "./LayerBase/StageLayer";
import { ref, shallowRef, watch } from "vue";
import StageEventState, { StageNormalEvent } from "./EventHandler/StageEventHandler";
import Project from "../components/Project/Project";
import { Group, LayerType, NormalLayer, Root } from "../components/Project/LayerStruct";

const instanceApp = shallowRef<StageApp | null>(null)

class StageApp extends Application {
    protected stageDom
    get containerDom() { return this.stageDom }
    public selectedLayer
    protected unWatchSelected

    protected _childLayer: StageLayer[] = []
    get childLayer() { return this._childLayer }

    appScale = ref(1)

    eventHandler: StageEventState = new StageNormalEvent(this);

    constructor(dom: HTMLDivElement) {
        super();
        this.stageDom = dom;
        this.stage.interactive = true;
        this.selectedLayer = shallowRef<StageLayer[]>([]);
        this.unWatchSelected = watch(this.selectedLayer, (newV, oldV) => {
            oldV.forEach((item) => {
                item.selected = false;
            })
            newV.forEach((item) => {
                item.selected = true;
            })
        })
        if (instanceApp.value != null)
            instanceApp.value.destroy();
        instanceApp.value = this;
    }

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
            this.eventHandler.handleMouseDown(e);
        }
        this.canvas.onmouseup = (e) => {
            this.eventHandler.handleMouseUp(e);
        }
        this.canvas.onmousemove = (e) => {
            this.eventHandler.handleMouseMove(e);
        }
        this.canvas.onwheel = (e) => {
            this.eventHandler.handleWheelChange(e);
        };
        this.canvas.onkeydown = (e) => {
            this.eventHandler.handleKeyDown(e);
        }
        this.canvas.onkeyup = (e) => {
            this.eventHandler.handleKeyUp(e);
        }
    }
    protected addSprite(project: Project) {
        const proRoot = project.root
        this.addLayer(proRoot);
        this.childLayer.forEach((v, i) => {
            v.zIndex = this.childLayer.length - i;
            this.stage.addChild(v);

            this.stage.addChild(v.mesh);
            v.mesh.zIndex = this.childLayer.length * 2 - i;
        })
    }
    protected addLayer(group: Root | Group) {
        for (const child of group.children.value) {
            if (child.type === LayerType.NormalLayer) {
                const normal = child as NormalLayer;
                const item = Project.instance.value!.assetList.get(normal.assetId);
                if (item == null) continue;
                const gra = new StageLayer({ texture: item, isShow: child.isVisible, layerId: normal.layerId });
                const tranformMat = new Matrix(1, 0, 0, 1, item.bound.left, item.bound.top);
                gra.setFromMatrix(tranformMat);
                this.childLayer.push(gra);
            } else {
                const gro = child as Group;
                this.addLayer(gro);
            }
        }
    }
    protected addBg(rect: { width: number, height: number }) {
        const bg = new Graphics();
        bg.rect(0, 0, rect.width, rect.height);
        bg.fill(0xECECEC)
        this.stage.addChild(bg)
    }
    protected calculateScale(project: Project) {
        /**
         * 计算scale，以适应视图大小和位置
         */
        const projectRect = project.root.bound
        const scaleX = this.screen.width / projectRect.width;
        const scaleY = this.screen.height / projectRect.height;
        const scale = scaleX > scaleY ? scaleY : scaleX;
        return scale;

    }

    destroy(rendererDestroyOptions?: RendererDestroyOptions | undefined, options?: DestroyOptions | undefined): void {
        this.unWatchSelected();
        super.destroy(rendererDestroyOptions, options);
    }
}

export default StageApp
export { instanceApp }