import { ImageAsset } from "../Project/ProjectAssets"
import MeshLayer from "./GraphicsBase/MeshLayer"
import TextureLayer from "./TextureBase/TextureLayer"
import { Container } from "pixi.js"

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
    set show(isShow: boolean) {
        this._show = isShow
    }
    constructor(option: GraphicsLayerOption) {
        super();
        this.layerRect = option.texture.bound;

        this.mesh = new MeshLayer(this);
        this.texture = new TextureLayer(option.texture.texture!, this);
        this.addChild(this.texture);
        this.addChild(this.mesh);

    }
    protected _showMesh = false
    set showMesh(isShow: boolean) {
        this._showMesh = isShow
    }

    get show() {
        return this._show
    }
    get showMesh() {
        return this._showMesh;
    }

    protected upDateTexturePoint(): void {

    }
    protected upDateTextureGeomtry(): void {

    }

    protected handleMousePressEvent(): void {
    }
    protected handleMouseMoveEvent(): void {

    }
    protected handleMouseUpEvent(): void {

    }


}

export default GraphicsLayer