/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-03-28 22:33:05
 */
import { DestroyOptions, Graphics } from "pixi.js";
import { ref, watch } from "vue";
import { instanceApp } from "../StageApp";
import MeshPoint from "./MeshPoint";
import MeshLine from "./MeshLine";
import RectInSelected from "./RectInSelected";
/** MeshLayer的构造信息*/
interface MeshOption {
    /**几何信息 */
    meshGeo?: {
        points: MeshPoint[],
        lines: MeshLine[],
    }
    /**初始包括所有点的矩形 */
    initRect: {
        width: number,
        height: number
    }
}
/**
 * 用于展示网格，管理控制点的类
 */
class MeshLayer extends Graphics {
    /**需要得知缩放，得出点的展示面积 */
    protected appScale: number = instanceApp.value?.appScale.value ?? 1;
    protected unwatchScale

    /**所有控制点 */
    protected pointList: MeshPoint[] = [];
    get listPoint() { return this.pointList }
    /**所有线 */
    protected lineList: MeshLine[] = [];
    get listLine() { return this.lineList }

    /**所有的选中的点 */
    protected selectPointList = new Set<MeshPoint>();
    get selectedPoints() { return [...this.selectPointList] }
    /**所有的选中的线 */
    protected selectLineList = new Set<MeshLine>();
    get selectedLines() { return [...this.selectLineList] }

    /**
     * 添加选中的点和线
     * @param p 选中点 
     * @param l 选中线
     */
    addSelected(p: MeshPoint[], l: MeshLine[]) {
        p.forEach((v) => {
            this.selectPointList.add(v);
        })
        l.forEach((v) => {
            this.selectLineList.add(v);
        })

        this.upDate();
    }

    /**
     * 移除全部的选中状态
     */
    removeAllSelected() {
        this.selectPointList.clear();
        this.selectLineList.clear();
        this.upDate();
    }

    /**
     * 移除选中的点
     * @param p 
     * @param l 
     */
    removeSelected(p: MeshPoint[], l: MeshLine[]) {
        p.forEach((v) => {
            this.selectPointList.delete(v);
        })
        l.forEach((v) => {
            this.selectLineList.delete(v);
        })
        this.upDate();
    }


    constructor(option: MeshOption) {
        super()
        this.unwatchScale = watch(instanceApp.value?.appScale ?? ref(1), (v) => {
            this.appScale = v;
            this.upDate();
        })
        this.generateFirstPoints(0, 0, option.initRect.width, option.initRect.height);

        this.upDate();
    }

    /**更新视图 */
    upDate() {
        this.clear()
        this.lineList.forEach((item) => {
            this.moveTo(item.p1.x, item.p1.y)
                .lineTo(item.p2.x, item.p2.y)
                .stroke({
                    color: 0xff0000,
                    width: 1 / this.appScale
                });
        })
        this.pointList.forEach((item) => {
            this.circle(item.x, item.y, 3 / this.appScale)
                .fill({
                    color: 0xff0000
                })
        })

        /**对于选中的目标进行更新 */
        this.selectLineList.forEach((item) => {
            this.moveTo(item.p1.x, item.p1.y)
                .lineTo(item.p2.x, item.p2.y)
                .stroke({
                    color: 0xff0000,
                    width: 2 / this.appScale
                });
        })
        this.selectPointList.forEach((item) => {
            this.circle(item.x, item.y, 6 / this.appScale)
                .stroke({
                    color: 0xff0000,
                    width: 2 / this.appScale
                })
        })
        /**当有多个点的时候展示选中的Rect */
        if (this.selectPointList.size > 1) {
            RectInSelected.upDate([...this.selectPointList], this);
        }
    }

    /**
     * 销毁 移除监听器
     * @param options 
     */
    destroy(options?: DestroyOptions | undefined): void {
        this.unwatchScale();
        super.destroy(options);
    }

    /**在没有几何图形的时候手动初始化几何图形 */
    generateFirstPoints(top: number, left: number, width: number, height: number) {
        const topLeft = new MeshPoint(left, top, 0, 0);
        const topRight = new MeshPoint(left + width, top, 1, 0);
        const buttonLeft = new MeshPoint(left, top + height, 0, 1);
        const buttonRight = new MeshPoint(left + width, top + height, 1, 1);

        const topMiddle = new MeshPoint(left + width / 2, top, 0.5, 0);
        const buttonMiddle = new MeshPoint(left + width / 2, top + height, 0.5, 1);

        this.pointList.push(topLeft);
        this.pointList.push(topRight);
        this.pointList.push(buttonLeft);
        this.pointList.push(buttonRight);
        this.pointList.push(topMiddle);
        this.pointList.push(buttonMiddle);

        const line1 = new MeshLine(topLeft, topMiddle);
        const line2 = new MeshLine(topMiddle, topRight);
        const line3 = new MeshLine(topRight, buttonRight);
        const line4 = new MeshLine(buttonRight, buttonMiddle);
        const line5 = new MeshLine(buttonMiddle, buttonLeft);
        const line6 = new MeshLine(buttonLeft, topLeft);
        const line7 = new MeshLine(topLeft, buttonMiddle);
        const line8 = new MeshLine(topMiddle, buttonRight);
        const line9 = new MeshLine(topMiddle, buttonMiddle);

        this.lineList.push(line1, line2, line3, line4, line5, line6, line7, line8, line9);
    }

    /**
     * 判断点是否被选中
     * @param point 测试点
     * @returns 
     */
    pointIsSelected(point: MeshPoint): boolean {
        return this.selectPointList.has(point);
    }
    /**
     * 判断线是否被选中
     * @param line 测试线
     * @returns 
     */
    lineIsSelected(line: MeshLine): boolean {
        return this.selectLineList.has(line);
    }

    /**
     * 寻找在该位置下面的点
     * @param x 坐标x
     * @param y 坐标y
     * @returns 找到的MeshPoint，未找到返回undefined
     */
    pointAtPosition(x: number, y: number): MeshPoint | undefined {
        const r = 5 / this.appScale;
        for (const p of this.pointList) {
            const d = (x - p.x) * (x - p.x) + (y - p.y) * (y - p.y);
            if (d < r * r)
                return p;
        }
        return undefined
    }

    /**
     * 寻找该为位置下的line
     * @param x 坐标x
     * @param y 坐标y
     * @returns 找到的MeshLine，未找到返回undefined
     */
    lineAtPosition(x: number, y: number): MeshLine | undefined {
        const r = 5 / this.appScale;
        for (const l of this.lineList) {
            if (l.ifHitLine(x, y, r)) {
                return l
            }
        }
        return undefined
    }

}
export default MeshLayer;