/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-07 22:56:32
 */
import { SelectedEventHandler } from "../EventHandler/StageEventHandler";
import RectInSelected from "../GraphicsBase/RectInSelected";
import StageLayer from "../LayerBase/StageLayer";
import StageApp from "../StageApp";
import EditHandler, { PenAddHandler } from "./EditMeshHandler";
import EditMeshLayer from "./EditMeshLayer";

class EditMeshMode {
    protected stage: StageApp

    protected _targetLayer: StageLayer
    protected initShowLayer: StageLayer[]


    protected _editMesh: EditMeshLayer
    constructor(stage: StageApp, target: StageLayer) {
        this.stage = stage;
        this._targetLayer = target;
        this.initShowLayer = stage.layerContainer.showedLayer;
        const pointList = target.mesh.clonePruePoint();
        const bound = RectInSelected.getBound(pointList);

        this._editMesh = new EditMeshLayer({
            top: bound.top,
            left: bound.left,
            width: bound.right - bound.left,
            height: bound.button - bound.top
        }, [
            [0, 1, 3],
            [0, 2, 3],
        ])
        this.targetLayer.textureLayer.upDateMesh([
            { x: bound.left, y: bound.top, u: 0, v: 0 },
            { x: bound.right, y: bound.top, u: 1, v: 0 },
            { x: bound.right, y: bound.button, u: 1, v: 1 },
            { x: bound.left, y: bound.button, u: 0, v: 1 },
        ], [0, 1, 2, 0, 2, 3])
    }

    enterEdit() {
        this.initShowLayer.forEach((v) => {
            if (v === this._targetLayer)
                return;
            v.show = false;
        })
        this.stage.layerContainer.setAllMeshVisible(false);
        this.stage.eventHandler.changeToState(new EditHandler(this.stage, this));
        this._editMesh.setFromMatrix(this.targetLayer.mesh.relativeGroupTransform)
        this.stage.stage.addChild(this._editMesh);
    }

    leaveEdit() {
        this.initShowLayer.forEach((v) => {
            v.show = true;
        })

        this.stage.eventHandler = new SelectedEventHandler(this.stage);
        this._editMesh.destroy();
    }

    get targetLayer() { return this._targetLayer }
    get editMesh() { return this._editMesh }

    setPenSelect(select: boolean) {
        if (select) {
            this.stage.eventHandler.changeToState(new PenAddHandler(this.stage, this))
        } else {
            this.stage.eventHandler.changeToState(new EditHandler(this.stage, this));
        }
    }


}
export default EditMeshMode;