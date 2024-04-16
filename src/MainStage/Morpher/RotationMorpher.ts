import { ref, watch } from "vue";
import StageLayer from "../LayerBase/StageLayer";
import { instanceApp } from "../StageApp";
import { xy } from "../TwoDType";
import Morpher, { MorpherOption } from "./Morpher";
import { generateBound } from "./util";
import { DestroyOptions } from "pixi.js";

class RotationMorpher extends Morpher {

    protected rotationPoint: xy
    protected rotationDegree: number

    private unwatchScale
    private appScale: number = instanceApp.value?.appScale.value ?? 1

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
        const r = 5 / this.appScale
        const d = (x - this.rotationPoint.x) * (x - this.rotationPoint.x) + (y - this.rotationPoint.y) * (y - this.rotationPoint.y);
        if (r * r > d) {
            return 0;
        } else {
            return undefined
        }
    }

    shallowUpDate(): void {
        this.circle(this.rotationPoint.x, this.rotationPoint.y, 5 / this.appScale)
            .fill({
                color: 0xff0000
            })
        const length = 100 / this.appScale
        const dLength = 3 / this.appScale
        this.moveTo(this.rotationPoint.x - Math.cos(this.rotationDegree) * dLength, this.rotationPoint.y - Math.sin(this.rotationDegree) * dLength)
            .lineTo(this.rotationPoint.x + Math.cos(this.rotationDegree) * dLength, this.rotationPoint.y + Math.cos(this.rotationDegree) * dLength)
            .lineTo(this.rotationPoint.x + Math.sin(this.rotationDegree) * length, this.rotationPoint.y - Math.cos(this.rotationDegree) * length)
            .closePath().fill({
                color: 0xff0000
            })


    }
    ifHitMorpher(x: number, y: number): boolean {
        return false;
    }
    setFromPointList(pointList: xy[], shouldUpDateParent: boolean): void {
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