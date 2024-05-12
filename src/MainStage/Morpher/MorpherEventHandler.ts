/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-13 23:20:48
 */

import KeyFrameData from "../../components/FrameAnimatorStage/KeyFrame";
import Project from "../../components/Project/Project";
import { instanceApp } from "../StageApp";
import { xy } from "../TwoDType";
import Morpher from "./Morpher";
import RectMorpher, { edge } from "./RectMorpher";
import RotationMorpher from "./RotationMorpher";
import mouseUrl from "/src/assets/arrow-repeat.svg"

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
                if (!this.handleIfHitKey()) {
                    return MorpherEventRes.DEFAUT;
                }
                this.changeToState(new DragPointHandler(this.context, index));
                return MorpherEventRes.CHANGE_DRAG_POINT
            }
            const rectHit = this.context.forEdgeRect.ifHitRect(point.x, point.y);
            if (rectHit != undefined) {
                if (!this.handleIfHitKey()) {
                    return MorpherEventRes.DEFAUT;
                }
                this.changeToState(new DragRectMorpherRect(this.context, rectHit, point))
                return MorpherEventRes.CHANGE_DRAG_POINT
            }
        }
        if (this.context instanceof RotationMorpher) {
            const hit = this.context.ifHitMorpher(point.x, point.y);
            if (hit) {

                if (!this.handleIfHitKey()) {
                    return MorpherEventRes.DEFAUT;
                }

                if (this.context.pointAtPosition(point.x, point.y) != undefined) {
                    this.changeToState(new DragPointHandler(this.context, 0));

                    return MorpherEventRes.CHANGE_DRAG_POINT
                } else {
                    this.changeToState(new DragRotationMorpher(this.context));
                    return MorpherEventRes.CHANGE_DRAG_POINT
                }

            }
        }
        return MorpherEventRes.DEFAUT
    }

    protected handleIfHitKey() {
        const entry = Project.instance.value!.entryManager.registerEntry(this.context.morpherId);
        if (entry.length == 0) {
            return true
        }
        const before = Project.instance.value!.entryManager.getEntryKeyValue();
        let upDateFlag = false;
        for (const en of entry) {
            if (!en.ifHitKey(this.context.morpherId)) {
                en.currentValue = en.nearestKey(this.context.morpherId);
                upDateFlag = true;
            }
        }
        if (upDateFlag) {
            const after = Project.instance.value!.entryManager.getEntryKeyValue();
            instanceApp.value!.movementRecord.upDateRecord(before, after);
            instanceApp.value!.movementRecord.applyRecord();
            return false;
        }
        return true;
    }

    handleMouseMoveEvent(e: MouseEvent): MorpherEventRes {
        const point = this.toStagePos(e.offsetX, e.offsetY);
        if (this.context instanceof RectMorpher) {
            const hitRect = this.context.forEdgeRect.ifHitRect(point.x, point.y);
            if (hitRect == undefined) {
                instanceApp.value!.containerDom.style.cursor = "default";
                return MorpherEventRes.DEFAUT
            }
            if (hitRect == edge.CENTER) {
                instanceApp.value!.containerDom.style.cursor = "move";
            }
            if (hitRect == edge.LEFT || hitRect == edge.RIGHT) {
                instanceApp.value!.containerDom.style.cursor = "ew-resize";
            }
            if (hitRect == edge.TOP || hitRect == edge.BUTTON) {
                instanceApp.value!.containerDom.style.cursor = "ns-resize";
            }
            if (hitRect == edge.BUTTONRIGHT || hitRect == edge.TOPLEFT) {
                instanceApp.value!.containerDom.style.cursor = "nwse-resize"
            }
            if (hitRect == edge.BUTTONLEFT || hitRect == edge.TOPRIGHT) {
                instanceApp.value!.containerDom.style.cursor = "nesw-resize"
            }
            return MorpherEventRes.HIT_POINT
        }
        if (this.context instanceof RotationMorpher) {
            const hitMorpher = this.context.ifHitMorpher(point.x, point.y);
            if (!hitMorpher) {
                instanceApp.value!.containerDom.style.cursor = "default"
                return MorpherEventRes.DEFAUT;
            }
            const ifHitPoint = this.context.pointAtPosition(point.x, point.y);
            if (ifHitPoint != undefined) {
                instanceApp.value!.containerDom.style.cursor = "move";
                return MorpherEventRes.DEFAUT;
            }
            instanceApp.value!.containerDom.style.cursor = `url("${mouseUrl}") 12 12, auto`
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
        this.context.setFromPointList(points, true);
        if (this.context instanceof RectMorpher) {
            this.context.forEdgeRect.resizeFormPointList(this.context.points)
        }
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
        const entry = Project.instance.value!.entryManager.registerEntry(this.context.morpherId);
        for (const en of entry) {

            const bound = Project.instance.value!.root.bound;
            const uvs = this.context.points.map((v) => ({ u: v.x / bound.width, v: v.y / bound.height }))
            let rotation: number | undefined = undefined
            if (this.context instanceof RotationMorpher) {
                rotation = this.context.currentRotation
            }
            en.setKeyData(this.context.morpherId, new KeyFrameData(en.currentValue, uvs, rotation));

        }
        this.changeToState(new MorpherSelectHandler(this.context))
        return MorpherEventRes.DEFAUT
    }
}

class DragRectMorpherRect extends MorpherEventHandler {
    protected dragItem
    protected context
    protected firstDrag
    protected lastDrag
    constructor(context: RectMorpher, witch: edge, point: xy) {
        super(context);
        this.context = context;
        this.dragItem = witch
        this.firstDrag = point;
        this.lastDrag = point;
    }

    handleMouseMoveEvent(e: MouseEvent): MorpherEventRes {
        const last = this.toStagePos(e.offsetX, e.offsetY);

        this.context.forEdgeRect.extrusion(this.dragItem, last.x - this.lastDrag.x, last.y - this.lastDrag.y);
        this.lastDrag = last;

        return MorpherEventRes.DRAG_POINT
    }

    handleMouseUpEvent(_e: MouseEvent): MorpherEventRes {
        const entry = Project.instance.value!.entryManager.registerEntry(this.context.morpherId);
        for (const en of entry) {

            const bound = Project.instance.value!.root.bound;
            const uvs = this.context.points.map((v) => ({ u: v.x / bound.width, v: v.y / bound.height }))
            let rotation: number | undefined = undefined
            en.setKeyData(this.context.morpherId, new KeyFrameData(en.currentValue, uvs, rotation));

        }
        this.context.forEdgeRect.resizeFormPointList(this.context.points);

        this.changeToState(new MorpherSelectHandler(this.context));
        return MorpherEventRes.DEFAUT
    }
}
class DragRotationMorpher extends MorpherEventHandler {
    protected context: RotationMorpher
    constructor(context: RotationMorpher) {
        super(context);
        this.context = context;
    }
    handleMouseMoveEvent(e: MouseEvent): MorpherEventRes {
        const point = this.toStagePos(e.offsetX, e.offsetY);
        const xLength = point.x - this.context.rPoint.x;
        const yLength = -point.y + this.context.rPoint.y;
        const degree = Math.atan2(xLength, yLength);
        this.context.rotateDeg(degree);


        return MorpherEventRes.DRAG_POINT

    }
    handleMouseUpEvent(_e: MouseEvent): MorpherEventRes {
        const entry = Project.instance.value!.entryManager.registerEntry(this.context.morpherId);
        for (const en of entry) {

            const bound = Project.instance.value!.root.bound;
            const uvs = this.context.points.map((v) => ({ u: v.x / bound.width, v: v.y / bound.height }))
            let rotation: number | undefined = undefined
            if (this.context instanceof RotationMorpher) {
                rotation = this.context.currentRotation
            }
            en.setKeyData(this.context.morpherId, new KeyFrameData(en.currentValue, uvs, rotation));

        }
        this.changeToState(new MorpherSelectHandler(this.context));
        return MorpherEventRes.DEFAUT
    }
}
export default MorpherEventHandler

export { MorpherSelectHandler, DragPointHandler, MorpherEventRes }