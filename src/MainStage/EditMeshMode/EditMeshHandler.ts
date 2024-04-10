/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-08 07:53:09
 */

import StageEventHandler, { DragStageEventHandler, RectSelectEventHandler, SelectedEventHandler, StageEventRes } from "../EventHandler/StageEventHandler";
import MeshPoint from "../GraphicsBase/MeshPoint";
import RectInSelected from "../GraphicsBase/RectInSelected";
import StageApp from "../StageApp";
import { xy } from "../TwoDType";
import EditMeshMode from "./EditMeshMode";
import Delaunay from "./delaunay";


class StageMoveHandler extends DragStageEventHandler {
    protected mode: EditMeshMode
    protected returnState?: StageEventHandler
    handleKeyUpEvent(e: KeyboardEvent): StageEventRes {
        if (e.code === "Space") {
            this.changeToState(this.returnState!);
            this.returnState!.handleKeyUpEvent(e);
        }
        return StageEventRes.DEFAULT
    }
    stateEffect(preState: StageEventHandler): void {
        super.stateEffect(preState);
        this.returnState = preState
    }
    constructor(context: StageApp, mode: EditMeshMode) {
        super(context);
        this.mode = mode;
    }
}

class EditHandler extends SelectedEventHandler {

    protected mode: EditMeshMode

    handleKeyDownEvent(e: KeyboardEvent): StageEventRes {
        if (e.code === "Space") {
            const newState = new StageMoveHandler(this.context, this.mode);
            this.changeToState(newState);
        }

        if (e.code === "Backspace") {
            const select = this.mode.editMesh.selectedPoints;
            this.mode.editMesh.delePoints(select);
            this.mode.editMesh.upDate();
        }
        return StageEventRes.DRAG_STAGE
    }
    handleClickEvent(e: MouseEvent): StageEventRes {
        const targetLayer = this.mode.targetLayer;
        const point = targetLayer.transformFormStage(this.toStagePos(e.offsetX, e.offsetY));
        const hitPoint = this.mode.editMesh.pointAtPosition(point.x, point.y);
        if (!e.shiftKey) {
            this.mode.editMesh.removeAllSelected();
        }
        if (hitPoint != undefined) {
            this.mode.editMesh.addSelectItem(hitPoint, undefined);
        }

        return StageEventRes.DEFAULT;
    }

    handleLongPressEvent(e: MouseEvent): StageEventRes {
        const targetLayer = this.mode.targetLayer;
        const point = targetLayer.transformFormStage(this.toStagePos(e.offsetX, e.offsetY));
        const hitPoint = this.mode.editMesh.pointAtPosition(point.x, point.y);
        if (hitPoint != undefined) {
            this.changeToState(new DragPointHandler(this.context, this.mode, hitPoint));
            return StageEventRes.DEFAULT;
        }
        if (RectInSelected.ifHitRect(this.mode.editMesh.selectedPoints, point)) {
            this.changeToState(new RectDragHandler(this.context, this.mode, this.mode.editMesh.selectedPoints, point));
            return StageEventRes.DEFAULT;
        }
        this.changeToState(new RectSelect(this.toStagePos(e.offsetX, e.offsetY), this.context, this.mode));
        return StageEventRes.DEFAULT
    }
    handleMouseMoveEvent(e: MouseEvent): StageEventRes {
        const point = this.mode.targetLayer.transformFormStage(this.toStagePos(e.offsetX, e.offsetY));
        let hitRect = false
        if (RectInSelected.ifHitRect(this.mode.editMesh.selectedPoints, point)) {
            hitRect = true;
        }
        this.context.containerDom.style.cursor = hitRect ? "move" : "default";
        return StageEventRes.DEFAULT
    }

    constructor(context: StageApp, editMode: EditMeshMode) {
        super(context);
        this.mode = editMode;
    }
}


class DragPointHandler extends StageEventHandler {

    protected mode: EditMeshMode
    protected dragItem: MeshPoint
    protected returnState?: StageEventHandler
    constructor(context: StageApp, editMode: EditMeshMode, dragPoint: MeshPoint) {
        super(context);
        this.mode = editMode;
        this.dragItem = dragPoint;
        editMode.editMesh.removeAllSelected();
        editMode.editMesh.addSelectItem(dragPoint, undefined);
    }

    protected stateEffect(preState: StageEventHandler): void {
        this.returnState = preState
    }

    handleMouseMoveEvent(e: MouseEvent): StageEventRes {
        const p = this.mode.targetLayer.transformFormStage(this.toStagePos(e.offsetX, e.offsetY));
        this.dragItem.setPosition(p.x, p.y);
        const pointList = this.mode.editMesh.listPoint;
        const delaunay = new Delaunay<MeshPoint>(pointList);
        const data = delaunay.getTriangleData();
        this.mode.editMesh.setPoint(data.vertices, data.triangles);
        this.mode.editMesh.upDate();
        return StageEventRes.DEFAULT;
    }

    handleMouseUpEvent(_e: MouseEvent): StageEventRes {
        this.changeToState(this.returnState!);
        return StageEventRes.DEFAULT;
    }
}

class RectSelect extends RectSelectEventHandler {
    protected mode: EditMeshMode
    protected returnState?: StageEventHandler
    constructor(firstPoint: xy, context: StageApp, mode: EditMeshMode) {
        super(firstPoint, context);
        this.mode = mode;
    }

    protected stateEffect(preState: StageEventHandler): void {
        super.stateEffect(preState);
        this.returnState = preState
    }
    handleMouseUpEvent(e: MouseEvent): StageEventRes {
        const { x, y, width, height } = this.getRect();
        const p1 = this.mode.targetLayer.transformFormStage({ x, y });
        const p2 = this.mode.targetLayer.transformFormStage({ x: x + width, y });
        const p3 = this.mode.targetLayer.transformFormStage({ x: x + width, y: y + height })
        const p4 = this.mode.targetLayer.transformFormStage({ x, y: y + height });
        const rect = { p1, p2, p3, p4 };
        const ps: MeshPoint[] = [];
        for (const point of this.mode.editMesh.listPoint) {
            if (point.containInRect(rect)) {
                ps.push(point);
            }
        }
        if (!e.shiftKey) {
            this.mode.editMesh.removeAllSelected();
        }
        this.mode.editMesh.addSelected(ps, []);

        this.changeToState(this.returnState!);
        return StageEventRes.DEFAULT;
    }
}

class RectDragHandler extends StageEventHandler {
    protected mode: EditMeshMode
    protected lastMove: xy

    protected firstMovePoint: xy

    protected returnState?: StageEventHandler
    selectPoints
    constructor(context: StageApp, mode: EditMeshMode, selectPoints: MeshPoint[], firMove: xy) {
        super(context);
        this.mode = mode;
        this.selectPoints = selectPoints;
        this.firstMovePoint = firMove;
        this.lastMove = firMove;
    }
    protected stateEffect(preState: StageEventHandler): void {
        this.returnState = preState;
    }
    handleMouseMoveEvent(e: MouseEvent): StageEventRes {

        const point = this.mode.targetLayer.transformFormStage(this.toStagePos(e.offsetX, e.offsetY));
        RectInSelected.dragRectPoint(this.selectPoints, point.x - this.lastMove.x, point.y - this.lastMove.y, (_p) => {
            const delaunay = new Delaunay<MeshPoint>(this.mode.editMesh.listPoint);
            const data = delaunay.getTriangleData();
            this.mode.editMesh.setPoint(data.vertices, data.triangles);
            this.mode.editMesh.upDate();
        })
        this.lastMove = point;
        return StageEventRes.DEFAULT;
    }
    handleMouseUpEvent(_e: MouseEvent): StageEventRes {
        this.changeToState(this.returnState!);
        return StageEventRes.DEFAULT;
    }

}

class PenAddHandler extends EditHandler {
    handleClickEvent(e: MouseEvent): StageEventRes {
        const point = this.mode.targetLayer.transformFormStage(this.toStagePos(e.offsetX, e.offsetY));
        if (this.mode.editMesh.pointAtPosition(point.x, point.y) != undefined) {
            return super.handleClickEvent(e);
        }
        this.mode.editMesh.removeAllSelected();
        const p = new MeshPoint(point.x, point.y, 1, 1)
        this.mode.editMesh.addPoint(p);
        this.mode.editMesh.addSelectItem(p, undefined)
        this.mode.editMesh.upDate();
        return StageEventRes.CLICK
    }
}
export default EditHandler;

export { PenAddHandler }