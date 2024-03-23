import { Graphics } from "pixi.js";
import MeshPoint from "./MeshPoint";
import MeshLine from "./MeshLine";
import GraphicsLayer from "../GraphicsLayer";

class MeshLayer extends Graphics {
    update() {

    }
    pointList: MeshPoint[] = []
    lineList: MeshLine[] = []
    selectedPoint?: MeshPoint
    selectedLine?: MeshLine
    /**
     * 只能由GraphicsLayer创建
     */
    parentLayer: GraphicsLayer

    /**
     * AtPosition的函数以局部为坐标系
     * @returns 
     */
    pointAtPosition(): number | null {
        return 0;
    }
    lineAtPosition(): number | null {
        return 0;
    }
    constructor(parent: GraphicsLayer) {
        super()
        this.parentLayer = parent

    }

    generateFirstPoints(top: number, left: number, width: number, height: number) {
        const topLeft = new MeshPoint(left, top, this);
        const topRight = new MeshPoint(left + width, top, this);
        const buttonLeft = new MeshPoint(left, top + height, this);
        const buttonRight = new MeshPoint(left + width, top + height, this);
        this.pointList.push(topLeft);
        this.pointList.push(topRight);
        this.pointList.push(buttonLeft);
        this.pointList.push(buttonRight);

        const line1 = new MeshLine(topLeft, topRight);
        const line2 = new MeshLine(topLeft, buttonLeft);
        const line3 = new MeshLine(topRight, buttonRight);
        const line4 = new MeshLine(buttonLeft, buttonRight);
        const line5 = new MeshLine(topLeft, buttonRight);
        this.lineList.push(line1);
        this.lineList.push(line2);
        this.lineList.push(line3);
        this.lineList.push(line4);
        this.lineList.push(line5);
    }

}
export default MeshLayer