/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-07 22:56:32
 */
import { SelectedEventHandler } from "../EventHandler/StageEventHandler";
import MeshPoint from "../GraphicsBase/MeshPoint";
import StageLayer from "../LayerBase/StageLayer";
import StageApp from "../StageApp";
import EditHandler from "./EditMeshHandler";
import EditMeshLayer from "./EditMeshLayer";
import Delaunay from "./delaunay";

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

        const del = new Delaunay<MeshPoint>(pointList);
        const ans = del.getTriangleData();
        this._editMesh = new EditMeshLayer({
            meshGeo: {
                points: ans.vertices,
                lines: [],
            },
            initRect: {
                width: 0,
                height: 0
            }
        }, ans.triangles)
    }

    enterEdit() {
        this.initShowLayer.forEach((v) => {
            if (v === this._targetLayer)
                return;
            v.show = false;
        })
        this.stage.layerContainer.setAllMeshVisible(false);
        this.stage.eventHandler = new EditHandler(this.stage, this);
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
}
export default EditMeshMode;