/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-03-30 11:34:21
 */
import { Container, DestroyOptions, Matrix } from "pixi.js";
import { Ref, watch } from "vue";
import MeshLayer from "../GraphicsBase/MeshLayer";
import TextureLayer from "../TextureBase/TextureLayer";
import { ImageAsset } from "../../components/Project/ProjectAssets";
import { ContainesPoint } from "./util";
import Project from "../../components/Project/Project";
import LayerEventState, { SelectState } from "../EventHandler/LayerEventHandler";
import RectInSelected from "../GraphicsBase/RectInSelected";
import { instanceApp } from "../StageApp";

type xy = { x: number, y: number }
type xyuv = xy & { u: number, v: number }
/**
 * StageLayer构造参数
 */
interface StageLayerOption {
    isShow: Ref<boolean>, //是否展示
    texture: ImageAsset, //图像资产
    layerId: string //Project对应的LayerId
}
class StageLayer extends Container {
    readonly layerId: string //Project对应的LayerId
    protected unWatchShow

    /**是否被选中，是否可见 */
    protected _selected: boolean = false
    protected _show: boolean = true;

    /**鼠标事件处理 */
    mouseState: LayerEventState

    /**layer下面的mesh展示图层 */
    protected faceMesh: MeshLayer
    get mesh() { return this.faceMesh }
    /**底部展示图片的图层 */
    protected _textureLayer: TextureLayer
    get textureLayer() { return this._textureLayer }

    /**是否选中，如果不可见直接返回 */
    set selected(isSelected: boolean) {
        if (!this._show) return

        this._selected = isSelected
        if (isSelected) this.faceMesh.alpha = 1;
        else {
            this.faceMesh.alpha = 0;
            this.faceMesh.removeAllSelected();
        }
    }
    get selected() { return this._selected }

    /**设置是否可见 */
    set show(isShow: boolean) {
        this._show = isShow;
        this.visible = isShow;
        this.textureLayer.visible = isShow;
        this.faceMesh.visible = isShow;

        if (!isShow) {
            this.selected = false;
        }
    }
    get show() {
        return this._show;
    }

    /**返回mesh层的所有点和线 */
    getPointList() { return this.faceMesh.listPoint; }
    getLineList() { return this.faceMesh.listLine; }

    /**展示预览的mesh */
    showTempMesh(isShow: boolean) {
        if (this.selected) return;
        if (isShow) this.faceMesh.alpha = 0.5;
        else this.faceMesh.alpha = 0;
    }


    constructor(option: StageLayerOption) {
        super();
        this.faceMesh = new MeshLayer({
            initRect: option.texture.bound
        })
        this._textureLayer = new TextureLayer({
            texture: option.texture,
            points: this.faceMesh.listPoint,
            lines: this.faceMesh.listLine
        })
        this.selected = false;

        this.layerId = option.layerId
        this.unWatchShow = watch(option.isShow, (newV) => {
            this.show = newV;
        })
        this.mouseState = new SelectState(this);

    }

    /**
     * 返回layer的局部坐标
     * @param stagePoint stage坐标 
     * @returns 局部坐标
     */
    transformFormStage(stagePoint: xy) {
        return {
            x: stagePoint.x,
            y: stagePoint.y
        }
    }

    /**
     * 
     * @param point 局部坐标 
     * @returns 当局部坐标点在该mesh的一个三角形内时 返回三角形的三个点，反之返回undefined
     */
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

    /**
     * 
     * @param point 局部坐标点
     * @returns 当局部坐标点命中了非透明像素的时候返回true，其余返回false
     */
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

    /**
     * 相当于hitLayer的弱化版
     * @param point 局部坐标
     * @returns 当坐标点包括在这个layer的矩形内时返回true
     */
    hitLayerRect(point: xy): boolean {
        const rect = RectInSelected.getBound(this.getPointList());
        const padding = 15 / (instanceApp.value?.appScale.value ?? 1);
        rect.top -= padding;
        rect.left -= padding;
        rect.button += padding;
        rect.right += padding;

        return point.x <= rect.right && point.x >= rect.left
            && point.y <= rect.button && point.y >= rect.top
    }

    /**
     * 销毁监听器
     * @param options 
     */
    destroy(options?: DestroyOptions | undefined): void {
        this.unWatchShow();
        super.destroy(options)
        this.faceMesh.destroy(options);
        this._textureLayer.destroy(options);
    }

    /**
     * 当点发生变化的时候更新图层
     */
    upDatePoint() {
        this.faceMesh.upDate();
        this.textureLayer.upDatePositionBuffer(this.getPointList());
    }

}
export default StageLayer