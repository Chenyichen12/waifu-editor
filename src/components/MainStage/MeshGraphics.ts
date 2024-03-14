import { Geometry, Mesh, Shader, Texture } from "pixi.js";
import vert from './layerShader.vert?raw'
import frag from './layerShader.frag?raw'
// interface MeshProp{
//     geometry: Geometry
// }
interface PositionList {
    position: number[],
    index: number[]
}
class MeshGraphics {

    Mesh
    pointList: PositionList
    constructor(texture: Texture) {
        this.pointList = {
            position: [
                0, 0,
                texture.width, 0,
                texture.width, texture.height,
                0, texture.height
            ],
            index: [0, 1, 2, 0, 2, 3]
        }
        const geometry = new Geometry({
            attributes: {
                aPosition: this.pointList.position,
                aUV: [
                    0, 0,
                    1, 0,
                    1, 1,
                    0, 1
                ]
            },
            indexBuffer: this.pointList.index
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
