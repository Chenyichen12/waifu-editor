/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-11 10:59:15
 */
import { ref, watch } from "vue";
import Project from "../../components/Project/Project";
import RectInSelected from "../GraphicsBase/RectInSelected";
import { instanceApp } from "../StageApp";
import { xy } from "../TwoDType";
import Morpher, { MorpherOption } from "./Morpher";
import { DestroyOptions } from "pixi.js";

interface RectMorpherOption extends MorpherOption {
    meshDot: { xDot: number, yDot: number },
}
class RectMorpher extends Morpher {
    protected rectPoints: xy[];
    protected xDot: number
    protected yDot: number
    readonly pointSize = 5
    private appScale = instanceApp.value?.appScale.value ?? 1;
    private unwatchScale
    constructor(option: Partial<RectMorpherOption>) {
        super(option);
        if (option.children == undefined || option.children.length == 0) {
            throw new Error("矩形变形器至少包含一个图层")
        }
        let { rectLeft, rectTop, rectRight, rectButton } = this.generateBound();
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
                    y: rectTop + rectHeight * i / (yDot - 1)
                })
            }
        }

        this.unwatchScale = watch(instanceApp.value?.appScale ?? ref(1), (v) => {
            this.appScale = v;
            this.shallowUpDate();
        })
        this.shallowUpDate();
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


    private generateBound() {
        const farAway = 100000;
        let rectLeft = farAway;
        let rectTop = farAway;
        let rectRight = -farAway;
        let rectButton = -farAway;
        for (const layer of this.morpherChildren) {
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
    }
    ifHitMorpher(x: number, y: number): boolean {
        return false;
    }
}

export default RectMorpher;