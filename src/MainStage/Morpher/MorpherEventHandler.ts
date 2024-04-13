/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-13 23:20:48
 */

import { instanceApp } from "../StageApp";
import { xy } from "../TwoDType";
import Morpher from "./Morpher";
import RectMorpher from "./RectMorpher";


enum MorpherEventRes {
    DEFAUT,
    HIT_POINT,
    CHANGE_DRAG_POINT,
    DRAG_POINT
}
abstract class MorpherEventHandler {
    protected context: Morpher
    handleMouseMoveEvent(_e: MouseEvent): MorpherEventRes { return MorpherEventRes.DEFAUT }
    handleMouseDownEvent(_e: MouseEvent): MorpherEventRes { return MorpherEventRes.DEFAUT }
    handleMouseClickEvent(_e: MouseEvent): MorpherEventRes { return MorpherEventRes.DEFAUT }
    handleMouseLongPressEvent(_e: MouseEvent): MorpherEventRes { return MorpherEventRes.DEFAUT }
    handleMouseUpEvent(_e: MouseEvent): MorpherEventRes { return MorpherEventRes.DEFAUT }

    changeToState(handler: MorpherEventHandler) {
        this.context.eventHandler = handler;
    }
    constructor(context: Morpher) {
        this.context = context;
    }
    protected toStagePos(x: number, y: number): xy {
        return instanceApp.value!.stage.toLocal({ x, y })
    }
}

class MorpherSelectHandler extends MorpherEventHandler {
    handleMouseClickEvent(e: MouseEvent): MorpherEventRes {
        const point = this.toStagePos(e.offsetX, e.offsetY);
        if (this.context instanceof RectMorpher) {
            const p = this.context.pointAtPosition(point.x, point.y);
            if (!e.shiftKey) {
                this.context.removeAllSelect();
            }
            if (p != undefined) {
                this.context.addSelectPoint(p);
                return MorpherEventRes.HIT_POINT
            }
        }

        return MorpherEventRes.DEFAUT;
    }

    handleMouseLongPressEvent(e: MouseEvent): MorpherEventRes {
        const point = this.toStagePos(e.offsetX, e.offsetY);
        if (this.context instanceof RectMorpher) {
            const index = this.context.pointAtPosition(point.x, point.y);
            if (index != undefined) {
                this.changeToState(new DragPointHandler(this.context, index));
                return MorpherEventRes.CHANGE_DRAG_POINT
            }
        }
        return MorpherEventRes.DEFAUT
    }
}

class DragPointHandler extends MorpherEventHandler {
    dragIndex
    handleMouseMoveEvent(e: MouseEvent): MorpherEventRes {
        const point = this.toStagePos(e.offsetX, e.offsetY);
        const points = this.context.points;
        points[this.dragIndex] = {
            x: point.x,
            y: point.y
        }
        this.context.setFromPointList(points);
        return MorpherEventRes.DRAG_POINT
    }

    constructor(context: Morpher, dragIndex: number) {
        super(context)
        if (context instanceof RectMorpher) {
            context.removeAllSelect();
            context.addSelectPoint(dragIndex);
        }
        this.dragIndex = dragIndex
    }
    handleMouseUpEvent(_e: MouseEvent): MorpherEventRes {
        this.changeToState(new MorpherSelectHandler(this.context))
        return MorpherEventRes.DEFAUT
    }
}
export default MorpherEventHandler

export { MorpherSelectHandler, DragPointHandler, MorpherEventRes }