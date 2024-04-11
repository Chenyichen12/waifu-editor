/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-11 10:59:15
 */
import RectInSelected from "../GraphicsBase/RectInSelected";
import { xy } from "../TwoDType";
import Morpher, { MorpherOption } from "./Morpher";

interface RectMorpherOption extends MorpherOption {
    meshDot: { xDot: number, yDot: number },
}
class RectMorpher extends Morpher {
    protected rectPoints: xy[];
    protected xDot: number
    protected yDot: number


    constructor(option: Partial<RectMorpherOption>) {
        super(option);
        if (option.children == undefined || option.children.length == 0) {
            throw new Error("矩形变形器至少包含一个图层")
        }
        const { rectLeft, rectTop, rectRight, rectButton } = this.generateBound();
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
    }

    get points() { return this.rectPoints }
    get dot() {
        return {
            xDot: this.xDot,
            yDot: this.yDot
        }
    }

    getDotPoint(xDot: number, yDot: number) {
        if (xDot >= this.xDot || yDot >= this.yDot) {
            throw Error("Out Of Bound")
        }
        return this.rectPoints[yDot * this.xDot + xDot]
    }


    private generateBound() {
        const farAway = 100000;
        let rectLeft = farAway;
        let rectTop = farAway;
        let rectRight = -farAway;
        let rectButton = -farAway;
        for (const layer of this.children) {
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
}

export default RectMorpher;