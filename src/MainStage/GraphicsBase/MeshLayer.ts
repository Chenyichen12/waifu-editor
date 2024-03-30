/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-03-28 22:33:05
 */
import { DestroyOptions, Graphics } from "pixi.js";
import { ref, watch } from "vue";
import { instanceApp } from "../StageApp";
import MeshPoint from "./MeshPoint";
import MeshLine from "./MeshLine";
import RectInSelected from "./RecrInSelected";
interface MeshOption {
    meshGeo?: {
        points: MeshPoint[],
        lines: MeshLine[],
    }
    initRect: {
        width: number,
        height: number
    }
}
class MeshLayer extends Graphics {
    protected appScale: number = instanceApp.value?.appScale.value ?? 1;
    protected unwatchScale

    protected pointList: MeshPoint[] = [];
    get listPoint() { return this.pointList }
    protected lineList: MeshLine[] = [];
    get listLine() { return this.lineList }



    protected selectPointList = new Set<MeshPoint>();
    get selectedPoints() { return [...this.selectPointList] }
    protected selectLineList = new Set<MeshLine>();
    get selectedLines() { return [...this.selectLineList] }

    addSelected(p: MeshPoint[], l: MeshLine[]) {
        const lengthPoint = this.selectPointList.size;
        p.forEach((v) => {
            this.selectPointList.add(v);
        })
        l.forEach((v) => {
            this.selectLineList.add(v);
        })

        if (this.selectPointList.size == lengthPoint)
            this.upDate();
    }

    removeAllSelected() {
        this.selectPointList.clear();
        this.selectLineList.clear();
        this.upDate();
    }

    removeSelected(p: MeshPoint[], l: MeshLine[]) {
        p.forEach((v) => {
            this.selectPointList.delete(v);
        })
        l.forEach((v) => {
            this.selectLineList.delete(v);
        })
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
        if (this.selectPointList.size > 1) {
            RectInSelected.upDate([...this.selectPointList], this);
        }
    }

    destroy(options?: DestroyOptions | undefined): void {
        this.unwatchScale();
        super.destroy(options);
    }

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

    pointIsSelected(point: MeshPoint): boolean {
        return this.selectPointList.has(point);
    }
    lineIsSelected(line: MeshLine): boolean {
        return this.selectLineList.has(line);
    }

    pointAtPosition(x: number, y: number): MeshPoint | undefined {
        const r = 5 / this.appScale;
        for (const p of this.pointList) {
            const d = (x - p.x) * (x - p.x) + (y - p.y) * (y - p.y);
            if (d < r * r)
                return p;
        }
        return undefined
    }

    lineAtPosition(x: number, y: number): MeshLine | undefined {
        const r = 3 / this.appScale;
        for (const l of this.lineList) {
            const d = this.distanceFromLine(x, y, l);
            if (d < r * r) {
                return l
            }
        }
        return undefined
    }

    distanceFromLine(x: number, y: number, line: MeshLine): number {
        const A = line.p1.y - line.p2.y;
        const B = line.p2.x - line.p1.x;
        const C = line.p1.x * line.p2.y - line.p2.x * line.p1.y
        const f = A * x + B * y + C;
        return (f * f) / (A * A + B * B);
    }


}
export default MeshLayer;