/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-08 07:53:09
 */
import StageEventHandler, { RectSelectEventHandler, SelectedEventHandler, StageEventRes } from "../EventHandler/StageEventHandler";
import MeshPoint from "../GraphicsBase/MeshPoint";
import StageApp from "../StageApp";
import { xy } from "../TwoDType";
import EditMeshMode from "./EditMeshMode";
import Delaunay from "./delaunay";


class EditHandler extends SelectedEventHandler {

    protected mode: EditMeshMode

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
        this.changeToState(new RectSelect(this.toStagePos(e.offsetX, e.offsetY), this.context, this.mode));
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
    constructor(context: StageApp, editMode: EditMeshMode, dragPoint: MeshPoint) {
        super(context);
        this.mode = editMode;
        this.dragItem = dragPoint;
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
        this.changeToState(new EditHandler(this.context, this.mode));
        return StageEventRes.DEFAULT;
    }
}

class RectSelect extends RectSelectEventHandler {
    protected mode: EditMeshMode
    constructor(firstPoint: xy, context: StageApp, mode: EditMeshMode) {
        super(firstPoint, context);
        this.mode = mode;
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

        this.changeToState(new EditHandler(this.context, this.mode));
        return StageEventRes.DEFAULT;
    }
}
export default EditHandler;