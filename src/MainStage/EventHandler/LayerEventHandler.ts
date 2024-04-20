/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-03-30 08:46:47
 * 
 * 用于处理LayerStage的事件，处理键盘事件
 */

import KeyFrameData from "../../components/FrameAnimatorStage/KeyFrame"
import Project from "../../components/Project/Project"
import MeshLayer from "../GraphicsBase/MeshLayer"
import MeshLine from "../GraphicsBase/MeshLine"
import MeshPoint from "../GraphicsBase/MeshPoint"
import RectInSelected from "../GraphicsBase/RectInSelected"
import StageLayer from "../LayerBase/StageLayer"
import { instanceApp } from "../StageApp"
import { rect, xy } from "../TwoDType"

interface LayerEventOption {
    point: xy, // layer的局部坐标，和Stage的坐标不同 可以用StageLayer的transformFormStage转换
    mouseEvent: MouseEvent,
}

enum result {
    DEFAULT,

    HIT_POINT,
    HIT_LINE,
    NO_HIT_ITEM,

    DRAG_ITEM,
    DRAG_RECT,

    TRANSFORM_SELECT,
    TRANSFORM_DRAG,
    TRANSFORM_DRAG_RECT,

    ADD_SELECT
}

/**
 * StageLayer 处理鼠标事件抽象类
 * 仅在selected的时候才会派发这一类的事件
 */
abstract class LayerEventState {
    handleMouseDownEvent(_option: LayerEventOption): result { return result.DEFAULT }
    handleMouseMoveEvent(_option: LayerEventOption): result { return result.DEFAULT }
    handleMouseUpEvent(_option: LayerEventOption): result { return result.DEFAULT }

    handleLongPressEvent(_option: LayerEventOption): result { return result.DEFAULT }
    handleMouseClickEvent(_option: LayerEventOption): result { return result.DEFAULT }

    handleRectSelect(option: LayerEventOption, rec: rect) {
        const ps: MeshPoint[] = [];
        const ls: MeshLine[] = []
        this.context.getPointList().forEach((v) => {
            if (v.containInRect(rec))
                ps.push(v);
        })
        this.context.getLineList().forEach((v) => {
            if (v.containInRect(rec)) {
                ls.push(v);
            }
        })
        if (!option.mouseEvent.shiftKey) {
            this.context.mesh.removeAllSelected();
        }
        this.context.mesh.addSelected(ps, ls);
        if (ps.length != 0 || ls.length != 0)
            return result.ADD_SELECT
        return result.DEFAULT
    }

    context: StageLayer
    constructor(context: StageLayer) {
        this.context = context;
    }
}

class SelectState extends LayerEventState {
    handleMouseClickEvent(option: LayerEventOption): result {
        const mesh = this.context.mesh;
        const hitPoint = mesh.pointAtPosition(option.point.x, option.point.y);
        let hitLine: MeshLine | undefined
        if (hitPoint == undefined)
            hitLine = mesh.lineAtPosition(option.point.x, option.point.y);

        if (!option.mouseEvent.shiftKey) {
            mesh.removeAllSelected();
        }
        mesh.addSelectItem(hitPoint, hitLine);

        if (hitPoint != undefined) {
            return result.HIT_POINT
        }

        if (hitLine != undefined) {
            return result.HIT_LINE;
        }

        return result.NO_HIT_ITEM;
    }

    handleLongPressEvent(option: LayerEventOption): result {
        const mesh = this.context.mesh;
        const hitPoint = mesh.pointAtPosition(option.point.x, option.point.y);
        if (hitPoint != undefined) {
            mesh.removeAllSelected();
            mesh.addSelectItem(hitPoint, undefined);
            if (!this.handleIfInKey()) {
                return result.DEFAULT
            }
            this.context.mouseState = new DragItemState(hitPoint, this.context);
            return result.TRANSFORM_DRAG;
        }
        if (mesh.selectedPoints.length > 1 && RectInSelected.ifHitRect(mesh.selectedPoints, option.point)) {
            if (!this.handleIfInKey()) {
                return result.DEFAULT
            }
            this.context.mouseState = new DragRectState(option.point, mesh, this.context);
            return result.TRANSFORM_DRAG_RECT;
        }
        return result.DEFAULT
    }
    protected handleIfInKey() {
        const entry = Project.instance.value!.entryManager.registerEntry(this.context.layerId);
        if (entry.length == 0) {
            return true
        }
        const before = Project.instance.value!.entryManager.getEntryKeyValue();
        let upDateFlag = false;
        for (const en of entry) {
            if (!en.ifHitKey(this.context.layerId)) {
                en.currentValue = en.nearestKey(this.context.layerId);
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

}
class DragItemState extends LayerEventState {
    moveItem
    protected firstPoint: xy
    handleMouseMoveEvent(option: LayerEventOption): result {
        this.moveItem.setPosition(option.point.x, option.point.y);
        this.context.upDatePoint();
        return result.DRAG_ITEM
    }

    handleMouseUpEvent(_option: LayerEventOption): result {
        const undoFunc = () => {
            this.moveItem.setPosition(this.firstPoint.x, this.firstPoint.y);
            this.context.upDatePoint();
        }

        const entry = Project.instance.value!.entryManager.registerEntry(this.context.layerId);
        for (const en of entry) {

            const bound = Project.instance.value!.root.bound;
            const uvs = this.context.getPointList().map((v) => ({ u: v.x / bound.width, v: v.y / bound.height }))
            en.setKeyData(this.context.layerId, new KeyFrameData(en.currentValue, uvs));

        }

        Project.instance.value!.unDoStack.pushUnDo(undoFunc);
        this.context.mouseState = new SelectState(this.context);
        return result.TRANSFORM_SELECT
    }
    constructor(moveItem: MeshPoint, context: StageLayer) {
        super(context);
        this.firstPoint = moveItem.xy;
        this.moveItem = moveItem;
    }
}

class DragRectState extends LayerEventState {

    protected targetMesh: MeshLayer
    protected lastMove: xy

    protected firstMovePoint: xy

    protected select: MeshPoint[];
    handleMouseMoveEvent(option: LayerEventOption): result {
        RectInSelected.dragRectPoint(this.select, option.point.x - this.lastMove.x, option.point.y - this.lastMove.y, (_p) => {
            this.context.upDatePoint();
        })
        this.lastMove = option.point;
        return result.DRAG_RECT;
    }

    handleMouseUpEvent(_option: LayerEventOption): result {
        this.context.mouseState = new SelectState(this.context);

        const undo = () => {
            RectInSelected.dragRectPoint(this.select, this.firstMovePoint.x - this.lastMove.x, this.firstMovePoint.y - this.lastMove.y, (_p) => {
                this.context.upDatePoint();
            })
        }
        const entry = Project.instance.value!.entryManager.registerEntry(this.context.layerId);
        for (const en of entry) {

            const bound = Project.instance.value!.root.bound;
            const uvs = this.context.getPointList().map((v) => ({ u: v.x / bound.width, v: v.y / bound.height }))
            en.setKeyData(this.context.layerId, new KeyFrameData(en.currentValue, uvs));

        }
        Project.instance.value!.unDoStack.pushUnDo(undo);
        return result.TRANSFORM_SELECT
    }

    constructor(point: xy, targetMesh: MeshLayer, context: StageLayer) {
        super(context);
        this.lastMove = point;
        this.targetMesh = targetMesh;

        this.firstMovePoint = point;
        this.select = targetMesh.selectedPoints;
    }
}

export default LayerEventState

export { SelectState, DragItemState, result }