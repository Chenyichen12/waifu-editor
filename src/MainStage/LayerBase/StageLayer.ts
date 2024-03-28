import { Container, DestroyOptions, Matrix } from "pixi.js";
import { Ref, watch } from "vue";
import MeshLayer from "../GraphicsBase/MeshLayer";
import TextureLayer from "../TextureBase/TextureLayer";
import { ImageAsset } from "../../components/Project/ProjectAssets";
import { ContainesPoint } from "./util";
import Project from "../../components/Project/Project";

type xy = { x: number, y: number }
type xyuv = xy & { u: number, v: number }
interface StageLayerOption {
    isShow: Ref<boolean>,
    texture: ImageAsset
}
class StageLayer extends Container {

    protected unWatchShow

    protected _selected: boolean = false
    protected _show: boolean = true;

    protected faceMesh: MeshLayer
    protected textureLayer: TextureLayer
    public editMesh?: MeshLayer

    set selected(isSelected: boolean) {
        if (!this._show) return

        this._selected = isSelected
        if (isSelected) this.faceMesh.alpha = 1;
        else this.faceMesh.alpha = 0;
    }
    get selected() { return this._selected }

    set show(isShow: boolean) {
        this._show = isShow;
        this.visible = isShow;
        if (!isShow) {
            this.selected = false;
        }
    }
    get show() {
        return this._show;
    }

    getPointList() { return this.faceMesh.listPoint; }
    getLineList() { return this.faceMesh.listLine; }

    showTempMesh(isShow: boolean) {
        if (this.selected) return;
        if (isShow) this.faceMesh.alpha = 0.5;
        else this.faceMesh.alpha = 0;
    }

    setFromMatrix(matrix: Matrix): void {
        this.faceMesh.setFromMatrix(matrix);
        super.setFromMatrix(matrix);
    }

    constructor(option: StageLayerOption) {
        super();
        this.faceMesh = new MeshLayer({
            initRect: option.texture.bound
        })
        this.textureLayer = new TextureLayer({
            texture: option.texture,
            points: this.faceMesh.listPoint,
            lines: this.faceMesh.listLine
        })
        this.selected = false;
        this.addChild(this.textureLayer);

        this.unWatchShow = watch(option.isShow, (newV) => {
            this.show = newV;
        })
    }

    transformFormStage(stagePoint: xy) {
        return {
            x: stagePoint.x - this.position.x,
            y: stagePoint.y - this.position.y
        }
    }

    pointInTri(point: xy): { p1: xyuv, p2: xyuv, p3: xyuv } | undefined {
        const indexBuffer = this.textureLayer.geometry.getIndex().data;
        for (let i = 0; i < indexBuffer.length; i += 3) {
            const p1 = this.getPointList()[indexBuffer[i]];
            const p2 = this.getPointList()[indexBuffer[i + 1]];
            const p3 = this.getPointList()[indexBuffer[i + 2]];
            if (ContainesPoint.contains(p1, p2, p3, point)) {
                return { p1, p2, p3 };
            }
        }
        return undefined;
    }

    hitLayer(point: xy): boolean {
        const tri = this.pointInTri(point);
        if (tri == undefined) return false;
        const uv = ContainesPoint.uvCalculate(tri.p1, tri.p2, tri.p3, point);
        const assets = Project.instance.value?.assetList.get(
            this.textureLayer.textureId);
        if (assets == undefined) {
            return false
        }
        const array = assets.array!;
        const xIndex = Math.floor(assets.bound.width * uv.u);
        const yIndex = Math.floor(assets.bound.height * uv.v);
        const index = xIndex * 4 + assets.bound.width * yIndex * 4;
        if (index + 4 >= array.length || array[index + 4] === 0) {
            return false
        }
        return true;
    }

    destroy(options?: DestroyOptions | undefined): void {
        this.unWatchShow();
        super.destroy(options)
    }
}
export default StageLayer