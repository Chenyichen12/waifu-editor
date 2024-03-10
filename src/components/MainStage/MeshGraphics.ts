import { Geometry, Mesh, Shader, Texture } from "pixi.js";
import vert from './layerShader.vert?raw'
import frag from './layerShader.frag?raw'
// interface MeshProp{
//     geometry: Geometry
// }
class MeshGraphics {

    Mesh
    constructor(texture: Texture) {
        const geometry = new Geometry({
            attributes: {
                aPosition: [
                    0, 0,
                    texture.width, 0,
                    texture.width, texture.height,
                    0, texture.height
                ],
                aUV: [
                    0, 0,
                    1, 0,
                    1, 1,
                    0, 1
                ]
            },
            indexBuffer: [0, 1, 2, 0, 2, 3]
        })
        const shader = Shader.from({
            gl: {
                vertex: vert,
                fragment: frag
            },
            resources: {
                uTexture: texture.source
            }
        })

        this.Mesh = new Mesh({ shader: shader, geometry: geometry });
        //console.log(this.Mesh)
    }
}
export default MeshGraphics