/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-16 14:46:25
 */
import { ref, watch } from "vue";
import StageLayer from "../LayerBase/StageLayer";
import { instanceApp } from "../StageApp";
import { xy } from "../TwoDType";
import Morpher, { MorpherOption } from "./Morpher";
import { generateBound, rotationPoint } from "./util";
import { DestroyOptions } from "pixi.js";
import { ContainesPoint } from "../LayerBase/util";
import RectMorpher from "./RectMorpher";

class RotationMorpher extends Morpher {

    protected rotationPoint: xy
    protected rotationDegree: number

    private unwatchScale
    appScale = instanceApp.value?.appScale.value ?? 1;

    constructor(option: Partial<MorpherOption>, rotationPoint?: xy) {
        super(option)
        if (option.children == undefined || option.children.length == 0) {
            throw new Error("旋转变形器至少包含一个图层")
        }
        if (rotationPoint != undefined) {
            this.rotationPoint = rotationPoint;
        } else {
            const { rectLeft, rectRight, rectTop, rectButton } = generateBound(option.children);
            this.rotationPoint = {
                x: (rectRight + rectLeft) / 2,
                y: (rectTop + rectButton) / 2
            }
        }
        this.rotationDegree = 0;
        this.unwatchScale = watch(instanceApp.value?.appScale ?? ref(1), (v) => {
            this.appScale = v;
            if (this.show)
                this.shallowUpDate();
        })
        this.shallowUpDate();
    }

    destroy(options?: DestroyOptions | undefined): void {
        this.unwatchScale();
        super.destroy(options)
    }
    get points(): xy[] {
        return [this.rotationPoint]
    }
    pointAtPosition(x: number, y: number): number | undefined {
        const r = 10 / this.appScale
        const d = (x - this.rotationPoint.x) * (x - this.rotationPoint.x) + (y - this.rotationPoint.y) * (y - this.rotationPoint.y);
        if (r * r > d) {
            return 0;
        } else {
            return undefined
        }
    }

    shallowUpDate(): void {
        this.clear();
        this.circle(this.rotationPoint.x, this.rotationPoint.y, 10 / this.appScale)
            .fill({
                color: 0xff0000
            })
        const length = 100 / this.appScale
        const dLength = 5 / this.appScale
        this.moveTo(this.rotationPoint.x - Math.cos(this.rotationDegree) * dLength, this.rotationPoint.y - Math.sin(this.rotationDegree) * dLength)
            .lineTo(this.rotationPoint.x + Math.cos(this.rotationDegree) * dLength, this.rotationPoint.y + Math.cos(this.rotationDegree) * dLength)
            .lineTo(this.rotationPoint.x + Math.sin(this.rotationDegree) * length, this.rotationPoint.y - Math.cos(this.rotationDegree) * length)
            .closePath().fill({
                color: 0xff0000
            })
    }
    ifHitMorpher(x: number, y: number): boolean {
        const length = 100 / this.appScale;
        const dLength = 5 / this.appScale;
        const p1 = { x: this.rotationPoint.x - Math.cos(this.rotationDegree) * dLength, y: this.rotationPoint.y - Math.sin(this.rotationDegree) * dLength };
        const p2 = { x: this.rotationPoint.x + Math.cos(this.rotationDegree) * dLength, y: this.rotationPoint.y + Math.cos(this.rotationDegree) * dLength };
        const p3 = { x: this.rotationPoint.x + Math.sin(this.rotationDegree) * length, y: this.rotationPoint.y - Math.cos(this.rotationDegree) * length };

        return ContainesPoint.contains(p1, p2, p3, { x, y });

    }
    /**以y轴负方向为起始边 */
    rotateDeg(degree: number) {
        for (const child of this._morpherChildren) {
            if (child.data instanceof RectMorpher) {
                child.data.forEdgeRect.rotationFromPoint(degree - this.rotationDegree, this.rotationPoint);
                continue;
            }
            const point = this.getPointsFromChild(child.data).map((v) => {
                return rotationPoint(v, degree - this.rotationDegree, this.rotationPoint);
            });

            if (child.data instanceof Morpher) {
                child.data.setFromPointList(point, false);
            } else {
                child.data.getPointList().forEach((v, i) => {
                    v.x = point[i].x;
                    v.y = point[i].y;
                })
                child.data.mopherUpDate();
            }
        }
    }
    setFromPointList(pointList: xy[], _shouldUpDateParent: boolean): void {
        const movex = pointList[0].x - this.rotationPoint.x;
        const movey = pointList[0].y - this.rotationPoint.y;

        //degreeifChange

        for (const child of this._morpherChildren) {
            const points = this.getPointsFromChild(child.data).map((v) => {
                return {
                    x: v.x + movex,
                    y: v.y + movey
                }
            });

            if (child.data instanceof Morpher) {
                child.data.setFromPointList(points, false);
            } else {
                child.data.getPointList().forEach((v, i) => {
                    v.x = points[i].x;
                    v.y = points[i].y;
                })
                child.data.mopherUpDate();
            }
        }
        this.shallowUpDate();
        return
    }


    removeMopherChild(child: Morpher | StageLayer | (Morpher | StageLayer)[]): void {
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
    addMorpherChild(child: Morpher | StageLayer): void {
        this._morpherChildren.push({
            data: child
        })
    }
    upDateChildPointIndex(): void {
        return
    }

}

export default RotationMorpher