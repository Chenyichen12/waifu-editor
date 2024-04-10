/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-07 22:56:32
 */
import { width } from "@webtoon/psd/dist/utils";
import { SelectedEventHandler } from "../EventHandler/StageEventHandler";
import MeshLine from "../GraphicsBase/MeshLine";
import MeshPoint from "../GraphicsBase/MeshPoint";
import RectInSelected from "../GraphicsBase/RectInSelected";
import StageLayer from "../LayerBase/StageLayer";
import StageApp from "../StageApp";
import EditHandler, { PenAddHandler } from "./EditMeshHandler";
import EditMeshLayer from "./EditMeshLayer";
import EditTextureLayer from "./EditTextureOpterator";

class EditMeshMode {
    protected stage: StageApp

    protected _targetLayer: StageLayer
    protected initShowLayer: StageLayer[]


    protected _editMesh: EditMeshLayer
    protected _textureOperator: EditTextureLayer
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
        this._textureOperator = new EditTextureLayer(bound, this.targetLayer.textureLayer)
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
        this.completeEdit();
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


    protected completeEdit() {
        const points = this._editMesh.listPoint;
        const lines: MeshLine[] = []
        const triangles = this._editMesh.indexList;
        const textureBound = this._textureOperator.textureBound;
        const bound = {
            top: textureBound.top,
            left: textureBound.left,
            width: textureBound.right - textureBound.left,
            height: textureBound.button - textureBound.top
        }
        for (const triangle of triangles) {
            const p1 = points[triangle[0]];
            const p2 = points[triangle[1]];
            const p3 = points[triangle[2]];
            setUV(p1, bound);
            setUV(p2, bound);
            setUV(p3, bound);

            addLine(p1, p2);
            addLine(p2, p3);
            addLine(p3, p1);
        }
        this.targetLayer.mesh.resetGeo(points, lines);

        const index: number[] = [];
        triangles.forEach((v) => {
            index.push(v[0], v[1], v[2]);
        })
        this._targetLayer.textureLayer.upDateMesh(points, index);

        function addLine(p1: MeshPoint, p2: MeshPoint) {
            for (const line of p1.lines) {
                if (line.anotherPoint(p1) === p2) {
                    return;
                }
            }
            lines.push(new MeshLine(p1, p2));
        }

        function setUV(p: MeshPoint, bound: { top: number, left: number, width: number, height: number }) {
            const x = p.x - bound.left;
            const y = p.y - bound.top;
            p.setUV(x / bound.width, y / bound.height)
        }
    }
}
export default EditMeshMode;