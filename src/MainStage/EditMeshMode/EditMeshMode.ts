import MeshLayer from "../GraphicsBase/MeshLayer";
import StageLayer from "../LayerBase/StageLayer";
import StageApp from "../StageApp";

class EditMeshMode {
    protected stage: StageApp

    protected targetLayer: StageLayer
    protected initShowLayer: StageLayer[]


    protected editMesh: MeshLayer
    constructor(stage: StageApp, target: StageLayer) {
        this.stage = stage;
        this.targetLayer = target;
        this.initShowLayer = stage.layerContainer.showedLayer;
        this.editMesh = target.mesh.deepClone();
    }

    enterEdit() {
        this.initShowLayer.forEach((v) => {
            if (v === this.targetLayer)
                return;
            v.show = false;
        })
    }

    leaveEdit() {
        this.initShowLayer.forEach((v) => {
            v.show = true;
        })
    }
}