import { Application, ApplicationOptions, DestroyOptions, EventBoundary, Graphics, Matrix, RendererDestroyOptions } from "pixi.js";
import { ref, shallowRef, watch } from "vue";
import Project from "../Project/Project";
import GraphicsLayer from "./GraphicsLayer";
import { Group, LayerType, NormalLayer, Root } from "../Project/LayerStruct";
import MeshLayer from "./GraphicsBase/MeshLayer";


const instanceApp = shallowRef<StageApp | null>(null)

class StageApp extends Application {
    isMousePress = false;
    isSpacePress = false;
    appScale = ref(1);
    stageDom
    mouseState: StageState = new StageNormalState
    graphicsChildren: GraphicsLayer[] = []

    selectedMesh
    unWatchSelected
    constructor(dom: HTMLDivElement) {
        super();
        this.stageDom = dom;
        this.stage.interactive = true;
        this.selectedMesh = shallowRef<GraphicsLayer[]>([]);
        this.unWatchSelected = watch(this.selectedMesh, (newV, oldV) => {
            oldV.forEach((v) => {
                v.showMesh = false;
            })
            newV.forEach((v, i) => {
                v.showMesh = true;
                v.mesh.setFromMatrix(v.relativeGroupTransform);
                this.stage.addChild(v.mesh);
                v.mesh.zIndex = this.graphicsChildren.length + 1 + i;
            })
        })
        instanceApp.value = this;
    }

    destroy(rendererDestroyOptions?: RendererDestroyOptions | undefined, options?: DestroyOptions | undefined): void {
        this.unWatchSelected();
        super.destroy(rendererDestroyOptions, options);
    }
    async init(options?: (Partial<ApplicationOptions> | undefined)): Promise<void> {
        if (Project.instance.value?.root == null) {
            throw new Error("NoProject");
        }
        for (let child of this.stageDom.children) {
            this.stageDom.removeChild(child);
        }
        await super.init({
            ...options,
            background: "#4BC1F0",
            resizeTo: this.stageDom,
            preference: "webgl",
        });
        this.stageDom.appendChild(this.canvas);

        const projectRoot = Project.instance.value.root;
        const projectRect = projectRoot.bound;
        this.addBg(projectRect);
        this.addSprite();

        const scaleX = this.screen.width / projectRect.width;
        const scaleY = this.screen.height / projectRect.height;
        const scale = scaleX > scaleY ? scaleY : scaleX;
        this.appScale.value = scale;
        const scaleAfterX = projectRect.width * scale
        const scaleAfterY = projectRect.height * scale
        this.stage.scale.set(scale)
        this.stage.position.set(this.screen.width / 2 - scaleAfterX / 2, this.screen.height / 2 - scaleAfterY / 2)

        this.canvas.onmousedown = (e) => {
            this.mouseState.onMouseDown(e, this);
        }

        this.canvas.onmouseup = (e) => {
            this.mouseState.onMouseUp(e, this);
        }
        this.canvas.onmousemove = (e) => {
            this.mouseState.onMouseMove(e, this);
        }
        this.canvas.onwheel = (e) => {
            this.onWheelChange(e);
        };
    }
    protected addBg(rect: { width: number, height: number }) {
        const bg = new Graphics();
        bg.rect(0, 0, rect.width, rect.height);
        bg.fill(0xECECEC)
        this.stage.addChild(bg)
    }
    protected addSprite() {
        const proRoot = Project.instance.value!.root;
        this.addLayer(proRoot);
        this.graphicsChildren.forEach((v, i) => {
            v.zIndex = this.graphicsChildren.length - i;
            this.stage.addChild(v);
        })
    }
    protected addLayer(group: Root | Group) {
        for (const child of group.children.value) {
            if (child.type === LayerType.NormalLayer) {
                const normal = child as NormalLayer;
                const item = Project.instance.value!.assetList.get(normal.assetId);
                if (item == null) continue;
                const gra = new GraphicsLayer({ texture: item });
                const tranformMat = new Matrix(1, 0, 0, 1, item.bound.left, item.bound.top);
                gra.setFromMatrix(tranformMat);
                this.graphicsChildren.push(gra);
            } else {
                const gro = child as Group;
                this.addLayer(gro);
            }
        }
    }
    protected onWheelChange(e: WheelEvent) {
        const stagePos = this.stage.toLocal({ x: e.offsetX, y: e.offsetY });
        const oldZoom = this.stage.scale.x
        const scale = e.deltaY > 0 ? oldZoom * 0.95 : oldZoom * 1.05;
        const oldDx = stagePos.x * oldZoom - stagePos.x * scale;
        const oldDy = stagePos.y * oldZoom - stagePos.y * scale;
        this.stage.scale.set(scale);
        this.appScale.value = scale;
        this.stage.position.x += oldDx;
        this.stage.position.y += oldDy
    }
}

abstract class StageState {
    abstract onMouseDown(e: MouseEvent, context: StageApp): void
    abstract onMouseMove(e: MouseEvent, context: StageApp): void
    abstract onMouseUp(e: MouseEvent, context: StageApp): void
}

class StageNormalState extends StageState {
    onMouseDown(e: MouseEvent, context: StageApp): void {
        context.isMousePress = true;
        if (context.isMousePress && context.isSpacePress) {
            context.mouseState = new StageMoveState();
            return;
        }
        const stagePos = context.stage.toLocal({ x: e.offsetX, y: e.offsetY });
        for (const gra of context.graphicsChildren) {
            if (gra.containsPoint(stagePos)) {
                context.selectedMesh.value = [gra];
                return
            }
        }
        context.selectedMesh.value = [];
    }
    onMouseMove(_e: MouseEvent, _context: StageApp): void {
        return;
    }
    onMouseUp(_e: MouseEvent, context: StageApp): void {
        context.isMousePress = false;
        return;
    }
}

class StageMoveState extends StageState {
    //这个state不可能触发这个函数
    onMouseDown(_e: MouseEvent, _context: StageApp): void {
        return;
    }
    onMouseMove(e: MouseEvent, context: StageApp): void {
        context.stage.position.x += e.movementX;
        context.stage.position.y += e.movementY;
    }
    onMouseUp(_e: MouseEvent, context: StageApp): void {
        context.isMousePress = false;
        context.mouseState = new StageNormalState();
        return;
    }
}

export default StageApp
export { instanceApp }