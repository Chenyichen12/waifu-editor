import { DestroyOptions, Graphics } from "pixi.js";
import MeshPoint from "./MeshPoint";
import MeshLine from "./MeshLine";
import GraphicsLayer from "../GraphicsLayer";
import { ref, watch } from "vue";
import { instanceApp } from "../StageApp";
import selectedRect from "../SelectedRect";

class MeshLayer extends Graphics {

    protected appScale: number = instanceApp.value?.appScale.value ?? 1;
    protected unwatchScale

    update() {
        this.clear();
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
        this.selectedLine.forEach((item) => {
            this.moveTo(item.p1.x, item.p1.y)
                .lineTo(item.p2.x, item.p2.y)
                .stroke({
                    color: 0xff0000,
                    width: 2 / this.appScale
                });
        })
        this.selectedPoint.forEach((item) => {
            this.circle(item.x, item.y, 6 / this.appScale)
                .stroke({
                    color: 0xff0000,
                    width: 2 / this.appScale
                })
        })
        if (this.selectedPoint.length > 1) {
            selectedRect.upDateSelected(this.selectedPoint);
        }
    }
    pointList: MeshPoint[] = []
    lineList: MeshLine[] = []
    selectedPoint: MeshPoint[] = []
    selectedLine: MeshLine[] = []

    addSelectedItems(points: MeshPoint[], lines: MeshLine[]) {
        this.selectedPoint.push(...points);
        this.selectedLine.push(...lines);
        selectedRect.upDateSelected(this.pointList);
    }
    addSelectedItem(point: MeshPoint | null, line: MeshLine | null) {
        if (point != null && line != null) {
            this.addSelectedItems([point], [line]);
            return;
        }
        if (point != null) {
            this.addSelectedItems([point], []);
            return
        }
        if (line != null) {
            this.addSelectedItems([], [line]);
            return
        }

    }
    emptySelectedItems() {
        this.selectedPoint = [];
        this.selectedLine = [];
        selectedRect.upDateSelected(this.pointList);
    }
    removeSelectedItem(point: MeshPoint | null, line: MeshLine | null) {
        if (point != null) {
            this.selectedPoint = this.selectedPoint.filter((v) => {
                return v !== point;
            })
        }
        if (line != null) {
            this.lineList = this.lineList.filter((v) => {
                return v !== line;
            })
        }
        selectedRect.upDateSelected(this.pointList);
    }
    /**
     * 只能由GraphicsLayer创建
     */
    parentLayer: GraphicsLayer

    /**
     * AtPosition的函数以局部为坐标系
     * @returns 
     */
    pointAtPosition(x: number, y: number): MeshPoint | null {
        const r = 5 / this.appScale;
        for (const p of this.pointList) {
            const d = (x - p.x) * (x - p.x) + (y - p.y) * (y - p.y);
            if (d < r * r)
                return p;
        }
        return null
    }
    lineAtPosition(x: number, y: number): MeshLine | null {
        const r = 3 / this.appScale;
        for (const l of this.lineList) {
            const d = this.distanceFromLine(x, y, l);
            if (d < r * r) {
                return l
            }
        }
        return null
    }
    //返回的是平方距离
    distanceFromLine(x: number, y: number, line: MeshLine): number {
        const A = line.p1.y - line.p2.y;
        const B = line.p2.x - line.p1.x;
        const C = line.p1.x * line.p2.y - line.p2.x * line.p1.y
        const f = A * x + B * y + C;
        return (f * f) / (A * A + B * B);
    }
    constructor(parent: GraphicsLayer) {
        super()
        this.parentLayer = parent
        this.generateFirstPoints(0, 0, this.parentLayer.layerRect.width, this.parentLayer.layerRect.height);
        this.unwatchScale = watch(instanceApp.value?.appScale ?? ref(0), (v) => {
            this.appScale = v;
            this.update()
        })
        this.update();
    }

    generateFirstPoints(top: number, left: number, width: number, height: number) {
        const topLeft = new MeshPoint(left, top, 0, 0, this);
        const topRight = new MeshPoint(left + width, top, 1, 0, this);
        const buttonLeft = new MeshPoint(left, top + height, 0, 1, this);
        const buttonRight = new MeshPoint(left + width, top + height, 1, 1, this);

        const topMiddle = new MeshPoint(left + width / 2, top, 0.5, 0, this);
        const buttonMiddle = new MeshPoint(left + width / 2, top + height, 0.5, 1, this);

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
    destroy(options?: DestroyOptions | undefined): void {
        this.unwatchScale();
        super.destroy(options);
    }
}
export default MeshLayer
