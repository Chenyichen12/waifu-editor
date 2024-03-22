import { Geometry, Mesh as pixiMesh, Shader, Texture } from "pixi.js";
import vert from './layerShader.vert?raw'
import frag from './layerShader.frag?raw'
import MeshPoint from "./GraphicsBase/MeshPoint";
import { ref, watch } from "vue";
interface PositionList {
    position: MeshPoint[],
    index: number[],
}
class MeshGraphics {

    Mesh: pixiMesh<Geometry, Shader>
    pointList

    unWatchPoint

    createPoint(x: number, y: number) {
        return new MeshPoint(x, y, this);
    }

    protected changeToBuffer() {
        const res: number[] = [];
        this.pointList.value.position.forEach((v) => {
            res.push(v.x, v.y);
        })
        return res;
    }

    upDatePoint() {
        console.log("PointUpdate");

        const newPos = this.changeToBuffer();
        const positionBuffer = this.Mesh.geometry.getAttribute("aPosition").buffer;

        newPos.forEach((v, i) => {
            positionBuffer.data[i] = v;
        })
        positionBuffer.update();
    }

    upDateGeometry() {
    }
    constructor(texture: Texture) {

        const pList = {
            position: [
                this.createPoint(0, 0),
                this.createPoint(texture.width, 0),
                this.createPoint(texture.width, texture.height),
                this.createPoint(0, texture.height)
            ],
            index: [0, 1, 2, 0, 2, 3]
        }
        this.pointList = ref(pList);

        this.unWatchPoint = watch(this.pointList, (n, o) => {
            if (n.position.length === o.position.length) {
                this.upDatePoint();
            } else {
                this.upDateGeometry();
            }
        }, {
            deep: true,
        })

        const geometry = new Geometry({
            attributes: {
                aPosition: this.changeToBuffer(),
                aUV: [
                    0, 0,
                    1, 0,
                    1, 1,
                    0, 1
                ]
            },
            indexBuffer: this.pointList.value.index
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

        this.Mesh = new pixiMesh({ shader: shader, geometry: geometry });
        //console.log(this.Mesh)


    }
    destory() {
        this.Mesh.destroy()
        this.unWatchPoint();
    }
}
export default MeshGraphics
