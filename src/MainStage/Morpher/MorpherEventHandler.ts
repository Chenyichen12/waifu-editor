import { sayHello } from "pixi.js";
import StageEventHandler, { StageEventRes } from "../EventHandler/StageEventHandler";
import StageApp from "../StageApp";
import { rect, xy } from "../TwoDType";
import MorpherContainer from "./MorpherContainer";
import RectMorpher from "./RectMorpher";
import Morpher from "./Morpher";

/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-12 23:33:18
 */

abstract class MorpherEventHandler extends StageEventHandler {

    protected morpherContext: MorpherContainer
    handleRectSelect(_mouseEvent: MouseEvent, _rec: rect) { }
    constructor(context: StageApp, morpherContext: MorpherContainer) {
        super(context);
        this.morpherContext = morpherContext;
    }
    changeToState(state: MorpherEventHandler): void {
        this.morpherContext.eventHandler = state;
        state.stateEffect(this);
    }
}

class MorpherSelectEventHandler extends MorpherEventHandler {
    handleClickEvent(e: MouseEvent): StageEventRes {
        const point = this.toStagePos(e.offsetX, e.offsetY);
        const hitMorpher = this.morpherContext.pointHitSelectMorpher(point);
        if (hitMorpher != undefined) {
            if (hitMorpher instanceof RectMorpher) {
                const res = this.handleRectMorpherSelect(hitMorpher, point, e.shiftKey);
                return res ? StageEventRes.CLICK : StageEventRes.NOHITPOINT
            }
        }

        this.morpherContext.removeAllSelect();
        return StageEventRes.NOHIT
    }
    protected handleRectMorpherSelect(morpher: RectMorpher, point: xy, isShift: boolean): boolean {
        const index = morpher.pointAtPosition(point.x, point.y);
        if (!isShift) {
            morpher.removeAllSelect();
        }

        if (index != undefined) {
            morpher.addSelectPoint(index);
            return true;
        }
        return false;
    }
    handleLongPressEvent(e: MouseEvent): StageEventRes {
        const point = this.toStagePos(e.offsetX, e.offsetY);
        const hitMorpher = this.morpherContext.pointHitSelectMorpher(point);
        if (hitMorpher != undefined) {
            const mopherIndex = hitMorpher.pointAtPosition(point.x, point.y);
            if (mopherIndex != undefined) {
                this.changeToState(new DragMorpherEventHandler(this.context, this.morpherContext, hitMorpher, mopherIndex))
                return StageEventRes.DRAG_ITEM
            }
        }
        return StageEventRes.DEFAULT
    }
}

class DragMorpherEventHandler extends MorpherEventHandler {

    protected dragItem: {
        data: Morpher,
        index: number
    }
    constructor(context: StageApp, morpherContext: MorpherContainer, morpher: Morpher, pointIndex: number) {
        super(context, morpherContext);
        this.dragItem = { data: morpher, index: pointIndex }
        if (morpher instanceof RectMorpher) {
            morpher.addSelectPoint(pointIndex)
        }
    }

    handleMouseMoveEvent(e: MouseEvent): StageEventRes {
        const point = this.toStagePos(e.offsetX, e.offsetY);
        const itemPoints = this.dragItem.data.points;
        itemPoints[this.dragItem.index] = point;
        this.dragItem.data.setFromPointList(itemPoints);
        return StageEventRes.DRAG_ITEM;
    }

    handleMouseUpEvent(_e: MouseEvent): StageEventRes {
        this.changeToState(new MorpherSelectEventHandler(this.context, this.morpherContext));
        return StageEventRes.DEFAULT;
    }
}
export default MorpherEventHandler;
export { MorpherSelectEventHandler }