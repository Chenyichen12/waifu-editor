/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-11 10:59:15
 */
import { ref, watch } from "vue";
import Project from "../../components/Project/Project";
import RectInSelected from "../GraphicsBase/RectInSelected";
import { instanceApp } from "../StageApp";
import { xy } from "../TwoDType";
import Morpher, { MorpherChild, MorpherOption } from "./Morpher";
import { DestroyOptions } from "pixi.js";
import { ifInQuad, quadPerspectiveTransform, quadPointCalculate, quadUvCalculate } from "./util";
import StageLayer from "../LayerBase/StageLayer";

interface RectMorpherOption extends MorpherOption {
    meshDot: { xDot: number, yDot: number },
}

interface RectMorpherChild extends MorpherChild {
    pointsInWhichRect: number[]
}
type xyBefore = xy & { xBefore: number, yBefore: number }
class RectMorpher extends Morpher {

    /**
     * rectPoints很重要，一般只对其中的point进行修改操作，不能随意对其进行赋值添加，删除，如果要赋值最好不要更改顺序 否则很麻烦。
     * 在外界获取rectPoints时只能返回副本，防止外界修改xy
     */
    protected rectPoints: xyBefore[];
    protected xDot: number
    protected yDot: number
    readonly pointSize = 5
    private appScale = instanceApp.value?.appScale.value ?? 1;
    private unwatchScale

    protected _morpherChildren: RectMorpherChild[];


    protected selectPoint = new Set<xyBefore>();

    constructor(option: Partial<RectMorpherOption>) {
        super(option);
        if (option.children == undefined || option.children.length == 0) {
            throw new Error("矩形变形器至少包含一个图层")
        }

        let { rectLeft, rectTop, rectRight, rectButton } = this.generateBound(option.children!);
        //加padding
        const w = Project.instance.value!.root.bound.width;
        const h = Project.instance.value!.root.bound.height;
        const padding = (w > h ? h : w) / 50;

        rectLeft -= padding;
        rectTop -= padding;
        rectRight += padding;
        rectButton += padding;


        const { xDot, yDot } = option.meshDot ?? { xDot: 3, yDot: 3 }
        this.xDot = xDot; this.yDot = yDot

        this.rectPoints = [];
        const rectWidth = rectRight - rectLeft;
        const rectHeight = rectButton - rectTop;
        for (let i = 0; i < yDot; i++) {
            for (let j = 0; j < xDot; j++) {
                this.rectPoints.push({
                    x: rectLeft + rectWidth * j / (xDot - 1),
                    y: rectTop + rectHeight * i / (yDot - 1),
                    xBefore: rectLeft + rectWidth * j / (xDot - 1),
                    yBefore: rectTop + rectHeight * i / (yDot - 1),
                })
            }
        }

        const list = this.generatePointForIndex(option.children!)
        this._morpherChildren = list.map((v, i) => {
            return {
                data: option.children![i],
                pointsInWhichRect: v
            }
        })

        this.unwatchScale = watch(instanceApp.value?.appScale ?? ref(1), (v) => {
            this.appScale = v;
            this.shallowUpDate();
        })
        this.shallowUpDate();
    }

    set show(s: boolean) {
        super.show = s;

        if (!s) {
            this.selectPoint.clear();
        } else {
            this.shallowUpDate();
        }
    }
    destroy(options?: DestroyOptions | undefined): void {
        super.destroy(options);
        this.unwatchScale();
    }
    get points() { return [...this.rectPoints] }
    get dot() {
        return {
            xDot: this.xDot,
            yDot: this.yDot
        }
    }

    protected getDotPoint(xDot: number, yDot: number) {
        if (xDot >= this.xDot || yDot >= this.yDot) {
            throw Error("Out Of Bound")
        }
        return this.rectPoints[yDot * this.xDot + xDot]
    }

    pointAtPosition(x: number, y: number): number | undefined {
        const r = 5 / this.appScale;
        for (let i = 0; i < this.rectPoints.length; i++) {
            const p = this.rectPoints[i];
            const d = (x - p.x) * (x - p.x) + (y - p.y) * (y - p.y);
            if (d < r * r)
                return i;
        }
        return undefined
    }


    private generateBound(childLayer: (StageLayer | Morpher)[]) {
        const farAway = 100000;
        let rectLeft = farAway;
        let rectTop = farAway;
        let rectRight = -farAway;
        let rectButton = -farAway;
        for (const layer of childLayer) {
            let ps: xy[];
            if (layer instanceof Morpher) {
                ps = layer.points;
            } else {
                ps = layer.mesh.listPoint;
            }
            const { top, left, button, right } = RectInSelected.getBound(ps);
            rectTop = rectTop > top ? top : rectTop;
            rectLeft = rectLeft > left ? left : rectLeft;
            rectRight = rectRight < right ? right : rectRight;
            rectButton = rectButton < button ? button : rectButton;
        }
        return { rectLeft, rectTop, rectRight, rectButton }
    }

    private getRectFromIndex(i: number) {
        const left = i % (this.xDot - 1);
        const top = Math.floor(i / (this.yDot - 1));

        return {
            A: this.getDotPoint(left, top),
            B: this.getDotPoint(left + 1, top),
            C: this.getDotPoint(left + 1, top + 1),
            D: this.getDotPoint(left, top + 1),
        }
    }

    private static getNewRectFromIndex(i: number, pointList: xy[], xDot: number, yDot: number) {
        const left = i % (xDot - 1);
        const top = Math.floor(i / (yDot - 1));
        return {
            A: getDotPoint(left, top),
            B: getDotPoint(left + 1, top),
            C: getDotPoint(left + 1, top + 1),
            D: getDotPoint(left, top + 1),
        }

        function getDotPoint(x: number, y: number) {
            return pointList[y * xDot + x]
        }
    }
    private generatePointForIndex(childLayer: (StageLayer | Morpher)[]) {
        const layerPointIndex: number[][] = []
        for (const layer of childLayer) {
            let ps: xy[];
            if (layer instanceof Morpher) {
                ps = layer.points;
            } else {
                ps = layer.mesh.listPoint;
            }
            const pointInRect = this.distributePoint(ps)
            layerPointIndex.push(pointInRect);
        }
        return layerPointIndex;
    }

    private distributePoint(pointList: xy[]) {
        const rectNum = (this.xDot - 1) * (this.yDot - 1);
        return pointList.map((v) => {
            for (let index = 0; index < rectNum; index++) {
                const rect = this.getRectFromIndex(index);
                if (ifInQuad(rect.A, rect.B, rect.C, rect.D, v)) {
                    return index;
                }
            }
            return -1;
        });
    }

    shallowUpDate(): void {
        this.clear()

        for (let i = 0; i < this.yDot - 1; i++) {
            for (let j = 0; j < this.xDot; j++) {
                const p1 = this.getDotPoint(j, i);
                const p2 = this.getDotPoint(j, i + 1);
                this.moveTo(p1.x, p1.y)
                    .lineTo(p2.x, p2.y)
                    .stroke({
                        color: 0x00ff00,
                        width: 1 / this.appScale
                    });
            }
        }
        for (let i = 0; i < this.xDot - 1; i++) {
            for (let j = 0; j < this.yDot; j++) {
                const p1 = this.getDotPoint(i, j);
                const p2 = this.getDotPoint(i + 1, j);
                this.moveTo(p1.x, p1.y)
                    .lineTo(p2.x, p2.y)
                    .stroke({
                        color: 0x00ff00,
                        width: 1 / this.appScale
                    });
            }
        }
        this.rectPoints.forEach((item) => {
            this.circle(item.x, item.y, 3 / this.appScale)
                .fill({
                    color: 0x00ff00
                })
        })

        for (const item of this.selectPoint) {
            this.circle(item.x, item.y, 6 / this.appScale)
                .stroke({
                    color: 0x00ff00,
                    width: 2 / this.appScale
                })
        }
    }


    addSelectPoint(index: number) {
        if (this.selectPoint.has(this.rectPoints[index])) {
            return;
        }
        this.selectPoint.add(this.rectPoints[index]);
        this.shallowUpDate();
    }

    removeSelectPoint(index: number) {
        if (!this.selectPoint.has(this.rectPoints[index])) {
            return;
        }

        this.selectPoint.delete(this.rectPoints[index]);
        this.shallowUpDate();
    }

    removeAllSelect() {
        this.selectPoint.clear();
        this.shallowUpDate();
    }
    ifHitMorpher(x: number, y: number): boolean {
        const point = { x, y }
        const rectNum = (this.xDot - 1) * (this.yDot - 1);
        for (let index = 0; index < rectNum; index++) {
            const rect = this.getRectFromIndex(index);
            if (ifInQuad(rect.A, rect.B, rect.C, rect.D, point)) {
                return true;
            }
        }
        return false;
    }

    private getPointsFromChild(child: StageLayer | Morpher): xy[] {
        return child instanceof StageLayer ? [...child.getPointList()] : child.points
    }
    setFromPointList(pointList: xy[]): void {

        const beforeRect = this.rectPoints.map((v) => {
            return { x: v.xBefore, y: v.yBefore }
        })
        for (const child of this._morpherChildren) {
            const pList = this.getPointsFromChild(child.data);
            for (let index = 0; index < child.pointsInWhichRect.length; index++) {

                if (child.pointsInWhichRect[index] == -1) {
                    continue;
                }
                const originRect = this.getRectFromIndex(child.pointsInWhichRect[index])

                //if(point move)

                let uv = quadUvCalculate(originRect.A, originRect.B, originRect.C, originRect.D, pList[index]);

                let beforeRec = RectMorpher.getNewRectFromIndex(child.pointsInWhichRect[index], beforeRect, this.xDot, this.yDot)
                let resetBefor = quadPointCalculate(beforeRec.A, beforeRec.B, beforeRec.C, beforeRec.D, uv);
                const newI = this.inWhichRect(beforeRect[0], beforeRect[beforeRect.length - 1], resetBefor);

                if (newI != child.pointsInWhichRect[index]) {
                    child.pointsInWhichRect[index] = newI;
                    beforeRec = RectMorpher.getNewRectFromIndex(child.pointsInWhichRect[index], beforeRect, this.xDot, this.yDot);
                    uv = quadUvCalculate(beforeRec.A, beforeRec.B, beforeRec.C, beforeRec.D, resetBefor);
                }

                const newRect = RectMorpher.getNewRectFromIndex(child.pointsInWhichRect[index], pointList, this.xDot, this.yDot);
                pList[index] = quadPointCalculate(newRect.A, newRect.B, newRect.C, newRect.D, uv);

            }

            if (child.data instanceof StageLayer) {
                child.data.getPointList().forEach((v, i) => {
                    v.x = pList[i].x;
                    v.y = pList[i].y;
                })
                child.data.mopherUpDate();
            } else {
                child.data.setFromPointList(pList);
            }
        }
        this.rectPoints.forEach((v, i) => {
            v.x = pointList[i].x;
            v.y = pointList[i].y;
        })
        this.shallowUpDate();
    }

    protected inWhichRect(A: xy, D: xy, point: xy) {
        if (point.x < A.x || point.x > D.x || point.y > D.y || point.y < A.y) {
            return -1;
        }
        const dx = Math.floor((point.x - A.x) / ((D.x - A.x) / (this.xDot - 1)));
        const dy = Math.floor((point.y - A.y) / ((D.y - A.y) / (this.yDot - 1)));
        return dx + dy * (this.xDot - 1);
    }
    removeMopherChild(child: (Morpher | StageLayer) | (Morpher | StageLayer)[]): void {
        if (child instanceof Array) {
            this._morpherChildren = this._morpherChildren.filter((v) => {
                return !child.includes(v.data)
            })
        } else {
            this._morpherChildren = this._morpherChildren.filter((v) => {
                return v.data !== child
            })
        }
    }
    addMorpherChild(child: StageLayer | Morpher): void {
        const pointList = this.distributePoint(child instanceof StageLayer ? child.mesh.listPoint : child.points);
        this._morpherChildren.push({
            data: child,
            pointsInWhichRect: pointList
        })
    }

    upDateChildPointIndex(child: StageLayer | Morpher) {
        const pointList = this.distributePoint(child instanceof StageLayer ? child.mesh.listPoint : child.points);
        const s = this._morpherChildren.find((v) => {
            v.data === child
        })
        if (s != undefined) {
            s.pointsInWhichRect = pointList;
        }
    }
}

export default RectMorpher;