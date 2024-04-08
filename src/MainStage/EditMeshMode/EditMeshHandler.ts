/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-08 07:53:09
 */
import { SelectedEventHandler, StageEventRes } from "../EventHandler/StageEventHandler";
import StageApp from "../StageApp";
import EditMeshMode from "./EditMeshMode";

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

    constructor(context: StageApp, editMode: EditMeshMode) {
        super(context);
        this.mode = editMode;
    }
}