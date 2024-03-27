import { Geometry, Mesh, Shader } from "pixi.js";
import vert from './layerShader.vert?raw'
import frag from './layerShader.frag?raw'
import GraphicsLayer from "../GraphicsLayer";
import MeshLayer from "../GraphicsBase/MeshLayer";
import MeshLine from "../GraphicsBase/MeshLine";
import MeshPoint from "../GraphicsBase/MeshPoint";
import { ImageAsset } from "../../Project/ProjectAssets";

class TextureLayer extends Mesh<Geometry, Shader>{
    graParent: GraphicsLayer
    projectTexture: ImageAsset
    constructor(texture: ImageAsset, parent: GraphicsLayer) {
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
                uTexture: texture.texture!.source
            }
        })
        super({ geometry: geometry, shader: shader })
        this.graParent = parent
        this.projectTexture = texture;
    }
    get textureGeometry() {
        return this.projectTexture.bound;
    }
    /**
     * 给定一个mesh生成glbuffer 需要生成indexBuffer
     * 大概存在性能问题，需要优化
     * @param mesh 
     * @returns 
     */

    updatePositionBuffer() {
        const positionList: number[] = [];
        this.graParent.mesh.pointList.forEach((item) => {
            positionList.push(item.x, item.y);
        })
        const { buffer } = this.geometry.getAttribute("aPosition");
        buffer.data.forEach((_v, i) => {
            buffer.data[i] = positionList[i];
        });
        buffer.update();
    }
    static generateGlBuffer(mesh: MeshLayer) {
        const tranigleList: tranigle[] = []
        const alreadyLine = new Set<MeshLine>();
        for (const line of mesh.lineList) {
            alreadyLine.add(line);
            const p1 = line.p1;
            const p2 = line.p2;
            /**
             * 三层循环，虽然采用了alreadyLine进行一定的优化
             * 我觉得主要需要优化枚举line3的地方
             * 或者用枚举点来解决
             * 对每个点的边进行枚举，相邻的两个边一定存在三角形，之后标注每条边建立三角形
             */
            const findAll = () => {
                for (const line2 of p1.lines) {
                    if (alreadyLine.has(line2))
                        continue;
                    const p3 = line2.anotherPoint(p1)!;
                    for (const line3 of p3.lines) {
                        if (line3.anotherPoint(p3) === p2) {
                            const newtri = new tranigle(line, line2, line3);
                            const tri = tranigleList.find((v) => {
                                return v.isEqual(newtri);
                            });
                            if (tri == null) {
                                tranigleList.push(newtri);
                            }
                            break;
                        }
                    }
                }
            }
            findAll();
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
export { tranigle }