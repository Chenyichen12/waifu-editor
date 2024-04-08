/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-07 22:56:32
 */
import MeshLayer from "../GraphicsBase/MeshLayer";
import StageLayer from "../LayerBase/StageLayer";
import StageApp from "../StageApp";

class EditMeshMode {
    protected stage: StageApp

    protected _targetLayer: StageLayer
    protected initShowLayer: StageLayer[]


    protected _editMesh: MeshLayer
    constructor(stage: StageApp, target: StageLayer) {
        this.stage = stage;
        this._targetLayer = target;
        this.initShowLayer = stage.layerContainer.showedLayer;
        this._editMesh = target.mesh.deepClone();
    }

    enterEdit() {
        this.initShowLayer.forEach((v) => {
            if (v === this._targetLayer)
                return;
            v.show = false;
        })
    }

    leaveEdit() {
        this.initShowLayer.forEach((v) => {
            v.show = true;
        })
    }

    get targetLayer() { return this._targetLayer }
    get editMesh() { return this._editMesh }
}
export default EditMeshMode;