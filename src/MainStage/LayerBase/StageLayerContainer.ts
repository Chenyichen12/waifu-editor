
/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-03 19:27:41
 */

import { Container } from "pixi.js";
import { xy } from "../TwoDType";
import StageLayer from "./StageLayer";
import Project from "../../components/Project/Project";

class StageLayerContainer {
    protected _layers: StageLayer[] = []
    protected _selectedLayer = new Set<StageLayer>();

    protected _hiddenLayer = new Set<StageLayer>();
    pointHitLayer(StagePos: xy): StageLayer | undefined {
        for (const layer of this._layers) {
            const p = layer.transformFormStage(StagePos);
            if (layer.hitLayer(p) && layer.show) {
                return layer;
            }
        }
        return;
    }

    pointHitSelectedLayer(StagePos: xy) {
        for (const layer of this._selectedLayer) {
            const p = layer.transformFormStage(StagePos);
            if (layer.hitLayerRect(p)) {
                return layer;
            }
        }
        return;
    }

    addSelected(layers: StageLayer[]) {
        layers.forEach((v) => {
            v.selected = true;
            this._selectedLayer.add(v);
        })
        Project.instance.value!.currentSelectedLayer = layers.map((v) => v.layerId);
    }
    setSelected(layers: StageLayer[]) {
        this.removeAllSelected();
        layers.forEach((v) => {
            v.selected = true;
            this._selectedLayer.add(v);
        })
    }

    removeSelected(layers: StageLayer[]) {
        layers.forEach((v) => {
            v.selected = false;
            this._selectedLayer.delete(v);
        })
    }

    removeAllSelected() {
        this._selectedLayer.forEach((v) => {
            v.selected = false;
        })
        this._selectedLayer.clear();

    }

    protected textureContainer: Container | undefined;
    protected meshContainer: Container | undefined
    getMeshAndTexture() {
        if (this.textureContainer == undefined) {
            this.textureContainer = new Container();
            this._layers.forEach((v, i) => {
                v.textureLayer.zIndex = this._layers.length - i;
                this.textureContainer!.addChild(v.textureLayer);
            })
        }
        if (this.meshContainer == undefined) {
            this.meshContainer = new Container();
            this._layers.forEach((v, i) => {
                v.mesh.zIndex = this._layers.length - i;
                this.meshContainer!.addChild(v.mesh);
            })
        }

        return {
            texture: this.textureContainer!,
            mesh: this.meshContainer!
        }
    }

    get selectedLayer() { return this._selectedLayer; }
    // get layers() { return this._layers; }
    constructor(layers: StageLayer[]) {
        this._layers = layers;
    }

    get showedLayer() {

        return this._layers.filter((v) => {
            return v.show === true;
        })
    }

    addHideLayer(layer: StageLayer | StageLayer[]) {
        if (layer instanceof Array) {
            layer.forEach((v) => {
                this._hiddenLayer.add(v)
                v.show = false;
            });
        } else {
            this._hiddenLayer.add(layer);
            layer.show = false;
        }
    }

    showAllLayer() {
        this._layers.forEach((v) => { v.show = true });
        this._hiddenLayer.clear();
    }

    setAllMeshVisible(isVisible: boolean) {
        this._layers.forEach((v) => {
            v.mesh.visible = isVisible;
        })
    }

    getLayerById(id: string) {
        return this._layers.find((v) => {
            return v.layerId == id;
        })
    }

    findLayerWithNoParent() {
        return this._layers.filter((v) => {
            return v.morpherParent == undefined
        })
    }
}

export default StageLayerContainer;