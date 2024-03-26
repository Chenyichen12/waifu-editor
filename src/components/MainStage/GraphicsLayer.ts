import { ImageAsset } from "../Project/ProjectAssets"
import MeshLayer from "./GraphicsBase/MeshLayer"
import TextureLayer from "./TextureBase/TextureLayer"
import { Container, Rectangle } from "pixi.js"

enum State {
    MeshEditState,
    PointMoveState,
    HideMeshState,
}
interface GraphicsLayerOption {
    texture: ImageAsset
}
class GraphicsLayer extends Container {


    state: State = State.PointMoveState
    mesh: MeshLayer
    texture: TextureLayer

    layerRect: {
        height: number,
        width: number,
    }


    protected _show = true

    constructor(option: GraphicsLayerOption) {
        super();
        this.layerRect = option.texture.bound;

        this.mesh = new MeshLayer(this);
        this.texture = new TextureLayer(option.texture, this);
        this.addChild(this.texture);
        this.addChild(this.mesh);
        this.mesh.visible = false;
        this.hitArea = new Rectangle(0, 0, this.layerRect.width, this.layerRect.height);
    }

    protected _showMesh = false
    set showMesh(isShow: boolean) {
        this._showMesh = isShow
        if (isShow) {
            this.mesh.visible = true;
            this.mesh.update();
        } else {
            this.mesh.visible = false;
        }
    }
    set show(isShow: boolean) {
        this._show = isShow
        if (isShow) {
            this.visible = true;
        } else {
            this.showMesh = false;
            this.visible = false;
        }
    }
    get show() {
        return this._show
    }
    get showMesh() {
        return this._showMesh;
    }

    containsPoint(localPoint: { x: number, y: number }): boolean {
        /**
         * 判断点在哪个三角形内，根据三角形算出uv，判断uv的点是不是透明的
         */
        const a = this.texture.projectTexture.array;
        console.log(a);

        return true;
    }
}

export default GraphicsLayer