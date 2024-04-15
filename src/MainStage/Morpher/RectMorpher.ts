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
import { ifInQuad, rotationPoint, trianglePointCalculate, triangleUVCalculate } from "./util";
import StageLayer from "../LayerBase/StageLayer";
import { ContainesPoint } from "../LayerBase/util";
import MeshLine from "../GraphicsBase/MeshLine";
import MeshPoint from "../GraphicsBase/MeshPoint";

interface RectMorpherOption extends MorpherOption {
    meshDot: { xDot: number, yDot: number },
}

interface RectMorpherChild extends MorpherChild {
    /**每个矩形被分为两个三角形，number就是三角形数组的index */
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
    appScale = instanceApp.value?.appScale.value ?? 1;
    private unwatchScale

    protected _morpherChildren: RectMorpherChild[];


    protected selectPoint = new Set<xyBefore>();

    forEdgeRect: MorpherRectHandler
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
        this.forEdgeRect = new MorpherRectHandler(this);
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
                    if (ContainesPoint.contains(rect.A, rect.B, rect.D, v)) {
                        return index * 2
                    } else {
                        return index * 2 + 1;
                    }
                }
            }
            return -1;
        });
    }

    shallowUpDate(): void {
        this.clear()

        const r = 3 / this.appScale
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
            this.circle(item.x, item.y, r)
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
        const bound = this.forEdgeRect.rect;
        this.moveTo(bound.topLeft.x, bound.topLeft.y)
            .lineTo(bound.topRight.x, bound.topRight.y)
            .lineTo(bound.buttonRight.x, bound.buttonRight.y)
            .lineTo(bound.buttonLeft.x, bound.buttonLeft.y)
            .lineTo(bound.topLeft.x, bound.topLeft.y)
            .stroke({
                color: 0xff0000,
                width: 1 / this.appScale
            })

        const drawRect = (x: number, y: number) => {
            this.rect(x - 2 / this.appScale, y - 2 / this.appScale, 4 / this.appScale, 4 / this.appScale)
                .fill({
                    color: 0xff0000
                })
            return drawRect
        }

        drawRect(bound.topLeft.x, bound.topLeft.y)
            (bound.topRight.x, bound.topRight.y)
            (bound.buttonRight.x, bound.buttonRight.y)
            (bound.buttonLeft.x, bound.buttonLeft.y)
            ((bound.topLeft.x + bound.topRight.x) / 2, (bound.topLeft.y + bound.topLeft.y) / 2)
            ((bound.topRight.x + bound.buttonRight.x) / 2, (bound.topRight.y + bound.buttonRight.y) / 2)
            ((bound.buttonRight.x + bound.buttonLeft.x) / 2, (bound.buttonRight.y + bound.buttonLeft.y) / 2)
            ((bound.buttonLeft.x + bound.topLeft.x) / 2, (bound.buttonLeft.y + bound.topLeft.y) / 2)
            ((bound.topLeft.x + bound.buttonRight.x) / 2, (bound.topLeft.y + bound.buttonRight.y) / 2)
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

    private getTriangleFromIndex(rectPointList: xy[], i: number) {
        const index = Math.floor(i / 2);
        const ansRect = RectMorpher.getNewRectFromIndex(index, rectPointList, this.xDot, this.yDot);
        if (i % 2 == 0) {
            return {
                A: ansRect.A,
                B: ansRect.B,
                C: ansRect.D
            }
        } else {
            return {
                A: ansRect.B,
                B: ansRect.C,
                C: ansRect.D
            }
        }
    }
    setFromPointList(pointList: xy[]): void {
        for (const child of this._morpherChildren) {
            const pList = this.getPointsFromChild(child.data);
            for (let index = 0; index < child.pointsInWhichRect.length; index++) {

                if (child.pointsInWhichRect[index] == -1) {
                    continue;
                }
                const triangle = this.getTriangleFromIndex(this.rectPoints, child.pointsInWhichRect[index]);

                let resData = triangleUVCalculate(triangle.A, triangle.B, triangle.C, pList[index]);

                const newTri = this.getTriangleFromIndex(pointList, child.pointsInWhichRect[index]);

                pList[index] = trianglePointCalculate(newTri.A, newTri.B, newTri.C, resData.alpha, resData.beta, resData.gama);

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



class MorpherRectHandler {
    protected context: RectMorpher
    protected p1: xy
    protected p2: xy
    protected width: number
    protected height: number

    get rect() {
        return {
            topLeft: this.p1,
            topRight: { x: this.p1.x + Math.cos(this.rotation) * this.width, y: this.p1.y + Math.sin(this.rotation) * this.height },
            buttonRight: this.p2,
            buttonLeft: { x: this.p2.x - Math.cos(this.rotation) * this.width, y: this.p2.y - Math.sin(this.rotation) * this.height }
        }
    }

    private padding: number

    private rotation: number
    constructor(context: RectMorpher) {
        this.context = context;
        const border = context.points;
        const p1 = border[0];
        const p2 = border[border.length - 1];

        this.rotation = 0;
        this.padding = 5 / context.appScale
        this.p1 = { x: p1.x - this.padding, y: p1.y - this.padding }
        this.p2 = { x: p2.x + this.padding, y: p2.y + this.padding }

        this.width = p2.x - p1.x + this.padding * 2;
        this.height = p2.y - p1.y + this.padding * 2;
    }
    ifHitRect(x: number, y: number): edge | undefined {

        const p1 = { x: this.p1.x, y: this.p1.y }
        const p2 = { x: this.p1.x + Math.cos(this.rotation) * this.width, y: this.p1.y + Math.sin(this.rotation) * this.height }
        const p3 = { x: this.p2.x, y: this.p2.y }
        const p4 = { x: this.p2.x - Math.cos(this.rotation) * this.width, y: this.p2.y - Math.sin(this.rotation) * this.height }

        const p12 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }
        const p23 = { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2 }
        const p34 = { x: (p3.x + p4.x) / 2, y: (p3.y + p4.y) / 2 }
        const p41 = { x: (p4.x + p1.x) / 2, y: (p4.y + p1.y) / 2 }

        const distance = 3 / this.context.appScale
        if (ifHitPoint(p12, x, y, distance))
            return edge.TOP;
        if (ifHitPoint(p34, x, y, distance))
            return edge.BUTTON
        if (ifHitPoint(p41, x, y, distance))
            return edge.LEFT
        if (ifHitPoint(p23, x, y, distance))
            return edge.RIGHT

        if (ifHitPoint(p1, x, y, distance))
            return edge.TOPLEFT
        if (ifHitPoint(p2, x, y, distance))
            return edge.TOPRIGHT
        if (ifHitPoint(p3, x, y, distance))
            return edge.BUTTONRIGHT
        if (ifHitPoint(p4, x, y, distance))
            return edge.BUTTONLEFT

        const p5 = {
            x: (this.p1.x + this.p2.x) / 2,
            y: (this.p1.y + this.p2.y) / 2
        }

        const r = (p5.x - x) * (p5.x - x) + (p5.y - y) * (p5.y - y);
        if (r < 3 / this.context.appScale) {
            return edge.CENTER
        }

        return undefined

        function ifHitPoint(point: xy, x: number, y: number, r: number = 3) {
            const rtest = (point.x - x) * (point.x - x) + (point.y - y) * (point.y - y);
            if (rtest < r * r) {
                return true;
            }
            return false
        }
    }

    moveAllPoint(movementX: number, movementY: number) {
        const points = this.context.points.map((v) => {
            return { x: v.x + movementX, y: v.y + movementY }
        })

        this.p1.x += movementX;
        this.p1.y += movementY;
        this.p2.x += movementX;
        this.p2.y += movementY;

        this.context.setFromPointList(points);
    }

    rotationFromPoint(degree: number, point: xy) {
        const points = this.context.points.map((v) => {
            return rotationPoint(v, degree, point);
        })

        this.p1 = rotationPoint(this.p1, degree, point);
        this.p2 = rotationPoint(this.p1, degree, point);

        this.rotation += degree
        this.context.setFromPointList(points);
    }
    resizeFormPointList(pList: xy[]) {
        const zheng = pList.map((v) => {
            return rotationPoint(v, -this.rotation, { x: 0, y: 0 });
        })
        const res = RectInSelected.getBound(zheng);
        this.p1.x = res.left - this.padding;
        this.p1.y = res.top - this.padding;
        this.p2.x = res.right + this.padding;
        this.p2.y = res.button + this.padding;
        this.width = res.right - res.left;
        this.height = res.button - res.top;

        this.p1 = rotationPoint(this.p1, this.rotation, { x: 0, y: 0 });
        this.p2 = rotationPoint(this.p2, this.rotation, { x: 0, y: 0 });
    }

    extrusion(whichEdge: edge, moveMentX: number, moveMentY: number) {

        if (whichEdge == edge.CENTER) {
            this.moveAllPoint(moveMentX, moveMentY)
            return
        }

        const zheng = this.context.points.map((v) => {
            return rotationPoint(v, -this.rotation, { x: 0, y: 0 });
        })

        const zp1 = rotationPoint(this.p1, -this.rotation, { x: 0, y: 0 });
        //const zp2 = rotationPoint(this.p2, -this.rotation, { x: 0, y: 0 });

        const uvList = zheng.map((val) => {
            return {
                u: (val.x - zp1.x) / this.width,
                v: (val.y - zp1.y) / this.height
            }
        })
        if (whichEdge == edge.LEFT) {
            this.width -= moveMentX;
            this.p1.x += moveMentX;
            zp1.x += moveMentX
        }
        if (whichEdge == edge.RIGHT) {
            this.width += moveMentX;
            this.p2.x += moveMentX;
        }
        if (whichEdge == edge.TOP) {
            this.height -= moveMentY;
            this.p1.y += moveMentY;
            zp1.y += moveMentY
        }
        if (whichEdge == edge.BUTTON) {
            this.height += moveMentY
            this.p2.y += moveMentY;
        }
        if (whichEdge == edge.TOPLEFT) {
            const scale = Math.abs(moveMentX) > Math.abs(moveMentY) ? moveMentY / this.height : moveMentX / this.width
            this.p1.x += this.width * scale;
            zp1.x += this.width * scale;
            this.p1.y += this.height * scale
            zp1.y += this.height * scale

            this.width -= this.width * scale
            this.height -= this.height * scale;
        }
        if (whichEdge == edge.TOPRIGHT) {
            const scale = Math.abs(moveMentX) > Math.abs(moveMentY) ? -moveMentY / this.height : moveMentX / this.width

            this.p2.x += this.width * scale
            this.p1.y -= this.height * scale
            zp1.y -= this.height * scale

            this.width += this.width * scale
            this.height += this.height * scale;
        }
        if (whichEdge == edge.BUTTONRIGHT) {
            const scale = Math.abs(moveMentX) > Math.abs(moveMentY) ? moveMentY / this.height : moveMentX / this.width
            this.p2.x += this.width * scale;
            this.p2.y += this.height * scale

            this.width += this.width * scale
            this.height += this.height * scale;
        }
        if (whichEdge == edge.BUTTONLEFT) {
            const scale = Math.abs(moveMentX) > Math.abs(moveMentY) ? moveMentY / this.height : -moveMentX / this.width

            this.p1.x -= this.width * scale
            this.p2.y += this.height * scale
            zp1.x -= this.width * scale

            this.width += this.width * scale
            this.height += this.height * scale;
        }



        const remakePoint = uvList.map((v) => {
            const zheng2 = {
                x: zp1.x + v.u * this.width,
                y: zp1.y + v.v * this.height
            }
            return rotationPoint(zheng2, this.rotation, { x: 0, y: 0 })
        })
        this.context.setFromPointList(remakePoint)
    }
}
enum edge {
    LEFT, RIGHT, TOP, BUTTON, CENTER,
    TOPLEFT, TOPRIGHT, BUTTONRIGHT, BUTTONLEFT
}
export default RectMorpher;
export { edge }