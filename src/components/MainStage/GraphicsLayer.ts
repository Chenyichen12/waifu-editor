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
    //mesh: MeshLayer = new MeshLayer()
    //texture: TextureLayer

    layerRect: {
        height: number,
        width: number,
        left: number,
        top: number
    }

    protected _show = true
    set show(isShow: boolean) {
        this._show = isShow
    }
    constructor(option: GraphicsLayerOption) {
        super();
        this.layerRect = option.texture.bound;
        this.position.set(this.layerRect.left, this.layerRect.height);
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