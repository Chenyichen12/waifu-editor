/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-10 09:21:43
 */
import TextureLayer from "../TextureBase/TextureLayer";

class EditTextureLayer {

    protected bound
    textureLayer
    constructor(bound: { top: number, left: number, right: number, button: number }, texture: TextureLayer) {
        texture.upDateMesh([
            { x: bound.left, y: bound.top, u: 0, v: 0 },
            { x: bound.right, y: bound.top, u: 1, v: 0 },
            { x: bound.right, y: bound.button, u: 1, v: 1 },
            { x: bound.left, y: bound.button, u: 0, v: 1 },
        ], [0, 1, 2, 0, 2, 3])
        this.bound = bound;
        this.textureLayer = texture
    }

    get textureBound() { return this.bound }
}

export default EditTextureLayer;