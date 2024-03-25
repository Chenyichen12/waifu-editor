import { DestroyOptions, Graphics } from "pixi.js";
import MeshPoint from "./MeshPoint";
import MeshLine from "./MeshLine";
import GraphicsLayer from "../GraphicsLayer";
import { watch } from "vue";
import StageApp from "../StageApp";

class MeshLayer extends Graphics {

    protected appScale = StageApp.scale.value
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
        this.generateFirstPoints(0, 0, this.parentLayer.layerRect.width, this.parentLayer.layerRect.height);
        this.unwatchScale = watch(StageApp.scale, () => {
            this.appScale = StageApp.scale.value
            this.update()
        })
        this.update();
    }

    generateFirstPoints(top: number, left: number, width: number, height: number) {
        const topLeft = new MeshPoint(left, top, 0, 0, this);
        const topRight = new MeshPoint(left + width, top, 1, 0, this);
        const buttonLeft = new MeshPoint(left, top + height, 0, 1, this);
        const buttonRight = new MeshPoint(left + width, top + height, 1, 1, this);
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
    destroy(options?: DestroyOptions | undefined): void {
        this.unwatchScale();
        super.destroy(options);
    }
}
export default MeshLayer