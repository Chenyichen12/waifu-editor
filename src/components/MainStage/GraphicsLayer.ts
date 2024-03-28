import { Ref, ref, watch } from "vue"
import { ImageAsset } from "../Project/ProjectAssets"
import MeshLayer from "./GraphicsBase/MeshLayer"
import MeshPoint from "./GraphicsBase/MeshPoint"
import TextureLayer from "./TextureBase/TextureLayer"
import { Container, DestroyOptions, Matrix } from "pixi.js"
import { instanceApp } from "./StageApp"
import MeshLine from "./GraphicsBase/MeshLine"

enum State {
    MeshEditState,
    PointMoveState,
    HideMeshState,
    NormalState,
}
interface GraphicsLayerOption {
    texture: ImageAsset
    isShow: Ref<boolean>
}
class GraphicsLayer extends Container {

    isSelected: Ref<boolean> = ref(false);
    state: State = State.PointMoveState
    mesh: MeshLayer
    texture: TextureLayer

    editMesh?: MeshLayer
    mouseState: MouseState = new MouseNormalState();

    layerRect: {
        height: number,
        width: number,
    }
    setFromMatrix(matrix: Matrix): void {
        this.mesh.setFromMatrix(matrix);
        super.setFromMatrix(matrix);
    }

    protected _show = true
    unWatchVisible
    constructor(option: GraphicsLayerOption) {
        super();
        this.layerRect = option.texture.bound;

        this.mesh = new MeshLayer(this);
        this.texture = new TextureLayer(option.texture, this);
        this.addChild(this.texture);
        this.mesh.visible = false;
        this.unWatchVisible = watch(option.isShow, (v) => {
            this.show = v;
        })
    }
    destroy(options?: DestroyOptions | undefined): void {
        this.unWatchVisible();
        super.destroy(options);
    }
    protected _showMesh = false
    set showMesh(isShow: boolean) {
        this._showMesh = isShow
        if (isShow) {
            this.mesh.visible = true;
            this.mesh.alpha = 1;
        } else {
            this.mesh.visible = false;
        }
    }
    set show(isShow: boolean) {
        this._show = isShow
        if (isShow) {
            this.visible = true;
        } else {
            this.showMesh = false;
            this.visible = false;
        }
    }
    set showTempMesh(isShow: boolean) {
        if (this._showMesh == true) {
            return;
        }
        if (this._showMesh == false) {
            this.mesh.visible = isShow;
            if (isShow) {
                this.mesh.alpha = 0.5;
            }
        }
    }
    get show() {
        return this._show
    }
    get showMesh() {
        return this._showMesh;
    }

    /**
     * 大概也有一些性能问题需要解决
     * 也许判断uv和判断是否在三角形内可以一起计算
     */
    containsPoint(point: { x: number, y: number }): boolean {
        /**
         * 判断点在哪个三角形内，根据三角形算出uv，判断uv的点是不是透明的
         */
        let uv: {
            u: number,
            v: number
        } | null = null


        const tri = this.containsPointTri(point);
        if (tri != null) {
            uv = uvCalculate(tri.p1, tri.p2, tri.p3, point);
        }

        if (uv == null) {
            return false;
        }
        const array = this.texture.projectTexture.array!;

        const xIndex = Math.floor(this.texture.textureGeometry.width * uv.u);
        const yIndex = Math.floor(this.texture.textureGeometry.height * uv.v);
        const index = xIndex * 4 + this.texture.textureGeometry.width * yIndex * 4;
        if (index + 4 >= array.length || array[index + 4] === 0) {
            return false
        }
        return true;
    }

    tranformToLocal(localPoint: { x: number, y: number }) {
        return {
            x: localPoint.x - this.x,
            y: localPoint.y - this.y,
        }
    }

    containsPointTri(point: { x: number, y: number }): { p1: MeshPoint, p2: MeshPoint, p3: MeshPoint } | null {
        const indexBuffer = this.texture.geometry.getIndex().data;

        for (let i = 0; i < indexBuffer.length; i += 3) {
            const p1 = this.mesh.pointList[indexBuffer[i]];
            const p2 = this.mesh.pointList[indexBuffer[i + 1]];
            const p3 = this.mesh.pointList[indexBuffer[i + 2]];
            if (contains(p1, p2, p3, point)) {
                return { p1, p2, p3 };
            }
        }
        return null;
    }
}

/**
* 判断点是否在三角形内的函数
*/
type xy = { x: number, y: number }
class vec {
    static dot(v1: xy, v2: xy) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    static sub(v1: xy, v2: xy) {
        return {
            x: v1.x - v2.x,
            y: v1.y - v2.y
        }
    }
}
function contains(p1: xy, p2: xy, p3: xy, p: xy): boolean {
    const v0 = vec.sub(p2, p1);
    const v1 = vec.sub(p3, p1);
    const v2 = vec.sub(p, p1);

    const dot00 = vec.dot(v0, v0);
    const dot01 = vec.dot(v0, v1);
    const dot02 = vec.dot(v0, v2);
    const dot11 = vec.dot(v1, v1);
    const dot12 = vec.dot(v1, v2);

    const inverDeno = 1 / (dot00 * dot11 - dot00 * dot01);
    const u = (dot11 * dot02 - dot01 * dot12) * inverDeno;
    if (u < 0 || u > 1)
        return false;
    const v = (dot00 * dot12 - dot01 * dot02) * inverDeno;
    if (v < 0 || v > 1)
        return false;
    return u + v <= 1;
}

function uvCalculate(pa: MeshPoint, pb: MeshPoint, pc: MeshPoint, p: xy) {

    const ppb = vec.sub(p, pb);
    const pcb = vec.sub(pc, pb);
    const ppc = vec.sub(p, pc);
    const pac = vec.sub(pa, pc);
    const pab = vec.sub(pa, pb);
    const pbc = vec.sub(pb, pc);

    const alpha = (-ppb.x * pcb.y + ppb.y * pcb.x) / (-pab.x * pcb.y + pab.y * pcb.x);
    const beta = (-ppc.x * pac.y + ppc.y * pac.x) / (-pbc.x * pac.y + pbc.y * pac.x);
    const gama = 1 - alpha - beta;
    const u = alpha * pa.u + beta * pb.u + gama * pc.u;
    const v = alpha * pa.v + beta * pb.v + gama * pc.v;
    return {
        u, v
    }
}

interface GraphicsLayerEvent {
    preventDefault: boolean //当为false的时候调用者会继续事件处理
    context: GraphicsLayer
}
/**  如果鼠标位置在命中图层，则给图层派发事件，选中的图层优先派发
 * 鼠标按下，如果图层没有被选中，说明要选中图层
 * 如果图层被选中，需要给graphicslayer派发事件
 * 如果线被选中，阻止state的行为
 * 如果点被选中，阻止Stage的行为，进入PointDragState，需要拖动点。
 * 如果图层处于编辑模式，不改变texture，仅改变point的位置
 * 鼠标提起任何状态回到normalState
 */
abstract class MouseState {
    abstract handleMouseDown(position: xy, context: GraphicsLayer): GraphicsLayerEvent
    abstract handleMouseMove(position: xy, context: GraphicsLayer): GraphicsLayerEvent
    abstract handleMouseUp(position: xy, context: GraphicsLayer): GraphicsLayerEvent
    //在编辑模式下面，返回编辑的mesh
    getCurrentMesh(context: GraphicsLayer) {
        if (context.state == State.MeshEditState) {
            return context.editMesh!;
        }
        return context.mesh;
    }
}

class MouseNormalState extends MouseState {
    handleMouseDown(position: xy, context: GraphicsLayer): GraphicsLayerEvent {
        let preventDefault = false;
        if (!context.isSelected.value) {
            context.isSelected.value = true;
            return {
                preventDefault,
                context
            }
        }
        let p: MeshPoint | null = null;
        let l: MeshLine | null = null;
        const currentMesh = this.getCurrentMesh(context);
        p = currentMesh.pointAtPosition(position.x, position.y);
        if (p == null) {
            l = currentMesh.lineAtPosition(position.x, position.y);
        }

        if (p == null && l == null) {
            return {
                preventDefault,
                context
            }
        }

        //选中了线或者点，避免stage处理
        preventDefault = true;
        //多选模式
        if (instanceApp.value!.isShiftPress) {
            currentMesh.addSelectedItem(p, l);
        } else {
            currentMesh.emptySelectedItems();
            currentMesh.addSelectedItem(p, l);
        }
        if (currentMesh.selectedPoint.length == 1)
            context.mouseState = new MouseSingleItemGragState();
        return {
            preventDefault,
            context
        }
    }
    handleMouseMove(_position: xy, context: GraphicsLayer): GraphicsLayerEvent {
        return {
            preventDefault: false,
            context
        }
    }
    handleMouseUp(_position: xy, context: GraphicsLayer): GraphicsLayerEvent {
        return {
            preventDefault: false,
            context
        }
    }

}
class MouseSingleItemGragState extends MouseState {
    handleMouseDown(_position: xy, context: GraphicsLayer): GraphicsLayerEvent {
        return {
            preventDefault: false,
            context
        }
    }
    handleMouseMove(position: xy, context: GraphicsLayer): GraphicsLayerEvent {
        if (context.state === State.NormalState) {
            context.mesh.selectedPoint[0].setPosition(position.x, position.y);
            context.mesh.update();
            return {
                preventDefault: false,
                context
            }
        }
        if (context.state === State.MeshEditState) {
            const editMesh = context.editMesh!;
            editMesh.selectedPoint[0].setPosition(position.x, position.y);
            const tri = context.containsPointTri(position);
            if (tri != null) {
                const uv = uvCalculate(tri.p1, tri.p2, tri.p3, position);
                editMesh.selectedPoint[0].setUV(uv.u, uv.v);
            } else {
                editMesh.selectedPoint[0].setUV(position.x / context.layerRect.width, position.y / context.layerRect.height);
            }
            editMesh.update();
        }
        return {
            preventDefault: false,
            context
        }
    }
    handleMouseUp(position: xy, context: GraphicsLayer): GraphicsLayerEvent {
        if (context.state === State.MeshEditState) {
            const editMesh = context.editMesh!;
            editMesh.selectedPoint[0].setPosition(position.x, position.y);
            const tri = context.containsPointTri(position);
            if (tri != null) {
                const uv = uvCalculate(tri.p1, tri.p2, tri.p3, position);
                editMesh.selectedPoint[0].setUV(uv.u, uv.v);
            } else {
                editMesh.selectedPoint[0].setUV(position.x / context.layerRect.width, position.y / context.layerRect.height);
            }
        }
        context.mouseState = new MouseNormalState();
        return {
            preventDefault: false,
            context
        }
    }

}

export default GraphicsLayer