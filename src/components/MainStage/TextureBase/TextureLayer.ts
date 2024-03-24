import { Geometry, Mesh, Shader, Texture } from "pixi.js";
import vert from '../layerShader.vert?raw'
import frag from '../layerShader.frag?raw'
import GraphicsLayer from "../GraphicsLayer";
import MeshLayer from "../GraphicsBase/MeshLayer";
import MeshLine from "../GraphicsBase/MeshLine";
import MeshPoint from "../GraphicsBase/MeshPoint";

class TextureLayer extends Mesh<Geometry, Shader>{
    constructor(texture: Texture, parent: GraphicsLayer) {
        const bufferInformation = TextureLayer.generateGlBuffer(parent.mesh);
        const geometry = new Geometry({
            attributes: {
                aPosition: bufferInformation.positionList,
                aUV: bufferInformation.uvList,
            },
            indexBuffer: bufferInformation.indexBuffer
        });
        const shader = Shader.from({
            gl: {
                vertex: vert,
                fragment: frag
            },
            resources: {
                uTexture: texture.source
            }
        })
        super({ geometry: geometry, shader: shader })
    }
    static generateGlBuffer(mesh: MeshLayer) {
        const tranigleList: tranigle[] = []
        for (const line of mesh.lineList) {
            const p1 = line.p1;
            const p2 = line.p2;
            const anotherPoint = (p: MeshPoint, line: MeshLine) => {
                if (line.p1 === p) return line.p2
                else return line.p1;
            }
            for (const pl of p2.lines) {
                const p3 = anotherPoint(p2, pl);
                for (const l3 of p3.lines) {
                    if (anotherPoint(p3, l3) === p1) {
                        const newTri = new tranigle(line, pl, l3);
                        let flag = true
                        for (const tri of tranigleList) {
                            if (tri.isEqual(newTri)) {
                                flag = false;
                                break
                            }
                        }
                        if (flag) {
                            tranigleList.push(newTri);
                        }
                        break;
                    }
                }
            }

        }

        const positionList: number[] = [];
        const uvList: number[] = [];
        const indexBuffer: number[] = [];
        mesh.pointList.forEach((item) => {
            positionList.push(item.x, item.y);
            uvList.push(item.u, item.v);
        })
        for (const tri of tranigleList) {
            const p1 = tri.line1.p1;
            const p2 = tri.line1.p2;
            let p3: MeshPoint
            if (tri.line2.p1 === p1 || tri.line2.p1 === p2) {
                p3 = tri.line2.p2;
            } else {
                p3 = tri.line2.p1;
            }

            const p1Index = mesh.pointList.findIndex((item) => item === p1)!;
            const p2Index = mesh.pointList.findIndex((item) => item === p2)!;
            const p3Index = mesh.pointList.findIndex((item) => item === p3)!;
            indexBuffer.push(p1Index, p2Index, p3Index);
        }

        return {
            positionList,
            uvList,
            indexBuffer
        }
    }
}

class tranigle {
    line1: MeshLine
    line2: MeshLine
    line3: MeshLine
    constructor(l1: MeshLine, l2: MeshLine, l3: MeshLine) {
        this.line1 = l1;
        this.line2 = l2;
        this.line3 = l3;
    }

    isEqual(tra: tranigle) {
        const isContain = (line: MeshLine) => {
            return line === this.line1
                || line === this.line2
                || line === this.line3
        }
        return isContain(tra.line1)
            && isContain(tra.line2)
            && isContain(tra.line3)
    }
}

export default TextureLayer