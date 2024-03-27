import { ImageAsset } from "../Project/ProjectAssets"
import MeshLayer from "./GraphicsBase/MeshLayer"
import MeshPoint from "./GraphicsBase/MeshPoint"
import TextureLayer from "./TextureBase/TextureLayer"
import { Container, Matrix } from "pixi.js"

enum State {
    MeshEditState,
    PointMoveState,
    HideMeshState,
}
interface GraphicsLayerOption {
    texture: ImageAsset
}
class GraphicsLayer extends Container {


    state: State = State.PointMoveState
    mesh: MeshLayer
    texture: TextureLayer

    layerRect: {
        height: number,
        width: number,
    }
    setFromMatrix(matrix: Matrix): void {
        this.mesh.setFromMatrix(matrix);
        super.setFromMatrix(matrix);
    }

    protected _show = true

    constructor(option: GraphicsLayerOption) {
        super();
        this.layerRect = option.texture.bound;

        this.mesh = new MeshLayer(this);
        this.texture = new TextureLayer(option.texture, this);
        this.addChild(this.texture);
        this.mesh.visible = false;
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
    containsPoint(localPoint: { x: number, y: number }): boolean {
        /**
         * 判断点在哪个三角形内，根据三角形算出uv，判断uv的点是不是透明的
         */

        const indexBuffer = this.texture.geometry.getIndex().data;

        const point = {
            x: localPoint.x - this.x,
            y: localPoint.y - this.y
        }
        let uv: {
            u: number,
            v: number
        } | null = null
        for (let i = 0; i < indexBuffer.length; i += 3) {
            const p1 = this.mesh.pointList[indexBuffer[i]];
            const p2 = this.mesh.pointList[indexBuffer[i + 1]];
            const p3 = this.mesh.pointList[indexBuffer[i + 2]];
            if (contains(p1, p2, p3, point)) {
                //判断uv
                uv = uvCalculate(p1, p2, p3, point);
                break;
            }
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

export default GraphicsLayer