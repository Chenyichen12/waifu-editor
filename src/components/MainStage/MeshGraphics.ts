import { Geometry, Mesh, Shader, Texture } from "pixi.js";
import vert from './layerShader.vert?raw'
import frag from './layerShader.frag?raw'
// interface MeshProp{
//     geometry: Geometry
// }
class MeshGraphics {

    Mesh
    constructor(imageSrc: ImageBitmap) {
        const geometry = new Geometry({
            attributes: {
                aPosition: [
                    0, 0,
                    imageSrc.width, 0,
                    imageSrc.width, imageSrc.height,
                    0, imageSrc.height
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
        const texture = Texture.from(imageSrc);
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