/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-10 09:21:43
 */
import TextureLayer from "../TextureBase/TextureLayer";

class EditTextureLayer {

    protected bound

    protected preData
    textureLayer

    constructor(bound: { top: number, left: number, right: number, button: number }, texture: TextureLayer) {
        this.preData = texture.geometry;
        this.bound = bound;
        this.textureLayer = texture
    }

    get textureBound() {
        return this.bound
    }

    resetToOrigin() {
        this.textureLayer.geometry = this.preData;
    }

    enterEdit() {
        this.textureLayer.upDateMesh([
            {x: this.bound.left, y: this.bound.top, u: 0, v: 0},
            {x: this.bound.right, y: this.bound.top, u: 1, v: 0},
            {x: this.bound.right, y: this.bound.button, u: 1, v: 1},
            {x: this.bound.left, y: this.bound.button, u: 0, v: 1},
        ], [0, 1, 2, 0, 2, 3])
    }
}

export default EditTextureLayer;