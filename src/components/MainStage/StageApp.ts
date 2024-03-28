import { Application, ApplicationOptions, DestroyOptions, Graphics, Matrix, RendererDestroyOptions } from "pixi.js";
import { ref, shallowRef, watch } from "vue";
import Project from "../Project/Project";
import GraphicsLayer from "./GraphicsLayer";
import { Group, LayerType, NormalLayer, Root } from "../Project/LayerStruct";

const instanceApp = shallowRef<StageApp | null>(null)

class StageApp extends Application {
    isMousePress = false; //是否鼠标按下
    isSpacePress = false; //是否空格按下
    isShiftPress = false;
    appScale = ref(1); //视图的缩放
    protected stageDom //dom容器
    mouseState: StageState = new StageNormalState //鼠标的状态 状态模式
    graphicsChildren: GraphicsLayer[] = [] //stage所有的图层

    selectGraphicsLayer // 选中的图层
    protected unWatchSelected // 停止监听选中图层

    constructor(dom: HTMLDivElement) {
        super();
        this.stageDom = dom;
        this.stage.interactive = true;
        this.selectGraphicsLayer = shallowRef<GraphicsLayer[]>([]);
        this.unWatchSelected = watch(this.selectGraphicsLayer, (newV, oldV) => {
            oldV.forEach((v) => {
                v.showMesh = false;
            })
            newV.forEach((v) => {
                v.showMesh = true;
            })
        })
        instanceApp.value = this;
    }

    destroy(rendererDestroyOptions?: RendererDestroyOptions | undefined, options?: DestroyOptions | undefined): void {
        this.unWatchSelected();
        super.destroy(rendererDestroyOptions, options);
    }
    /**
     * app初始化的地点需要异步初始化
     * @param options 
     */
    async init(options?: (Partial<ApplicationOptions> | undefined)): Promise<void> {
        //当没有project的时候抛出异常
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

        /**
         * 计算scale，以适应视图大小和位置
         */
        const scaleX = this.screen.width / projectRect.width;
        const scaleY = this.screen.height / projectRect.height;
        const scale = scaleX > scaleY ? scaleY : scaleX;
        this.appScale.value = scale;
        const scaleAfterX = projectRect.width * scale
        const scaleAfterY = projectRect.height * scale
        this.stage.scale.set(scale)
        this.stage.position.set(this.screen.width / 2 - scaleAfterX / 2, this.screen.height / 2 - scaleAfterY / 2)

        //绑定事件
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
    //添加背景
    protected addBg(rect: { width: number, height: number }) {
        const bg = new Graphics();
        bg.rect(0, 0, rect.width, rect.height);
        bg.fill(0xECECEC)
        this.stage.addChild(bg)
    }

    //添加图层并展示
    protected addSprite() {
        const proRoot = Project.instance.value!.root;
        this.addLayer(proRoot);
        this.graphicsChildren.forEach((v, i) => {
            v.zIndex = this.graphicsChildren.length - i;
            this.stage.addChild(v);

            this.stage.addChild(v.mesh);
            v.mesh.zIndex = this.graphicsChildren.length * 2 - i;
        })
    }
    //递归添加图层
    protected addLayer(group: Root | Group) {
        for (const child of group.children.value) {
            if (child.type === LayerType.NormalLayer) {
                const normal = child as NormalLayer;
                const item = Project.instance.value!.assetList.get(normal.assetId);
                if (item == null) continue;
                const gra = new GraphicsLayer({ texture: item, isShow: child.isVisible });
                const tranformMat = new Matrix(1, 0, 0, 1, item.bound.left, item.bound.top);
                gra.setFromMatrix(tranformMat);
                this.graphicsChildren.push(gra);
            } else {
                const gro = child as Group;
                this.addLayer(gro);
            }
        }
    }

    //当滚轮滑动的时候放大缩小视图
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

/**
 * 鼠标状态，状态模式
 */
abstract class StageState {
    abstract onMouseDown(e: MouseEvent, context: StageApp): void
    abstract onMouseMove(e: MouseEvent, context: StageApp): void
    abstract onMouseUp(e: MouseEvent, context: StageApp): void
}

//找到第一个位置的item
function findFirstItemAtPosition(mousePosition: { offsetX: number, offsetY: number }, context: StageApp) {

    const stagePos = context.stage.toLocal({ x: mousePosition.offsetX, y: mousePosition.offsetY });

    //优先select的item
    for (const gra of context.selectGraphicsLayer.value) {
        const point = gra.tranformToLocal(stagePos);
        if (!gra.show) {
            continue;
        }
        if (gra.containsPoint(point)) {
            return gra;
        }
    }
    for (const gra of context.graphicsChildren) {
        //并不搜索不显示的图层
        if (!gra.show) {
            continue;
        }
        if (gra.containsPoint(stagePos)) {
            return gra;
        }
    }
    return null;
}
//现在还用不到
function findAllItemAtPosition(mousePosition: { offsetX: number, offsetY: number }, context: StageApp) {
    const stagePos = context.stage.toLocal({ x: mousePosition.offsetX, y: mousePosition.offsetY });
    const res: GraphicsLayer[] = []
    for (const gra of context.graphicsChildren) {
        if (!gra.show) {
            continue;
        }
        if (gra.containsPoint(stagePos)) {
            res.push(gra)
        }
    }
    return res;
}
/**
 * 正常状态鼠标事件
 */
class StageNormalState extends StageState {
    onMouseDown(e: MouseEvent, context: StageApp): void {
        context.isMousePress = true;
        //当空格和鼠标同时按下的时候进入拖动状态
        if (context.isMousePress && context.isSpacePress) {
            context.mouseState = new StageMoveState();
            return;
        }
        //当shift和鼠标一起按下的时候触发多选模式
        if (context.isMousePress && context.isShiftPress) {
            context.mouseState = new StageMutiState();
            context.mouseState.onMouseDown(e, context);
            return;
        }

        context.selectGraphicsLayer.value.forEach((item) => {
            item.isSelected.value = false;
        })
        const gra = findFirstItemAtPosition(e, context);
        if (gra == null) {
            context.selectGraphicsLayer.value = [];
            return
        }
        gra.mouseState.handleMouseDown(gra.tranformToLocal({
            x: e.offsetX, y: e.offsetY
        }), gra);
        context.selectGraphicsLayer.value = [gra];

    }
    //正常状态move进入图层的时候显示网格提示用户
    onMouseMove(e: MouseEvent, context: StageApp): void {
        //TODO
        const gra = findFirstItemAtPosition(e, context);
        gra?.mouseState.handleMouseMove(gra.tranformToLocal(
            context.stage.toLocal({ x: e.offsetX, y: e.offsetY })
        ), gra);


    }

    //正常状态鼠标提起
    onMouseUp(_e: MouseEvent, context: StageApp): void {
        context.isMousePress = false;
        return;
    }
}
/**
 * 拖动状态鼠标事件
 */
class StageMoveState extends StageState {
    //这个state不可能触发这个函数
    onMouseDown(_e: MouseEvent, _context: StageApp): void {
        return;
    }

    //拖动状态的时候需要改变stage的位置
    onMouseMove(e: MouseEvent, context: StageApp): void {
        context.stage.position.x += e.movementX;
        context.stage.position.y += e.movementY;
    }

    //当鼠标提起的时候退出拖动状态
    onMouseUp(_e: MouseEvent, context: StageApp): void {
        context.isMousePress = false;
        context.mouseState = new StageNormalState();
        return;
    }
}
//多选模式
class StageMutiState extends StageNormalState {
    onMouseDown(e: MouseEvent, context: StageApp): void {
        context.isMousePress = true;
        if (context.isShiftPress === false) {
            context.mouseState = new StageNormalState();
            context.mouseState.onMouseDown(e, context);
            return;
        }
        const gra = findFirstItemAtPosition(e, context);
        if (gra != null) {
            context.selectGraphicsLayer.value = [...context.selectGraphicsLayer.value, gra];
        }

    }
    onMouseUp(e: MouseEvent, context: StageApp): void {
        if (context.isShiftPress === false) {
            context.mouseState = new StageNormalState();
            context.mouseState.onMouseUp(e, context);
            return;
        }
        context.isMousePress = false;
    }
}

export default StageApp
export { instanceApp }