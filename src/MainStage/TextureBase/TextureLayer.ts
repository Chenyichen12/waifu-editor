/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-03-28 12:44:17
 */
import {Geometry, Mesh, Shader} from "pixi.js";
import {ImageAsset} from "../../components/Project/ProjectAssets";
import {GenerateGlBuffer} from "../LayerBase/util";
import MeshPoint from "../GraphicsBase/MeshPoint";
import MeshLine from "../GraphicsBase/MeshLine";
import vert from './layerShader.vert?raw'
import frag from './layerShader.frag?raw'
import {xy, xyuv} from "../TwoDType";
import {MergeExclusive} from "../twoSelectOne";

/**
 * texture所需信息
 */
interface TextureLayerOption {
    texture: ImageAsset, //所需的图像信息
    /**用于构造mesh的几何信息 */
    information: MergeExclusive<MeshInformation, glInformation>
}

interface MeshInformation {
    points: MeshPoint[],
    lines: MeshLine[]
}

interface glInformation {
    points: number[],
    uvs: number[],
    index: number[]
}

class TextureLayer extends Mesh<Geometry, Shader> {
    protected _textureId: string
    get textureId() {
        return this._textureId
    }

    constructor(option: TextureLayerOption) {
        let bufferInformation: {
            positionList: number[],
            uvList: number[],
            indexBuffer: number[]
        }

        if (option.information.lines != undefined) {
            bufferInformation = GenerateGlBuffer.generate(option.information.points, option.information.lines);
        } else {
            bufferInformation = {
                positionList: option.information.points,
                uvList: option.information.uvs,
                indexBuffer: option.information.index
            }
        }

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
                uTexture: option.texture.texture!.source
            }
        })
        super({geometry: geometry, shader: shader})

        this._textureId = option.texture.assetId;


    }

    /**
     * 当点发生变化，需要更新textureMesh
     * @param points 点的位置信息
     */
    upDatePositionBuffer(points: xy[]) {
        const positionList: number[] = [];
        points.forEach((item) => {
            positionList.push(item.x, item.y);
        })
        const {buffer} = this.geometry.getAttribute("aPosition");
        buffer.data.forEach((_v, i) => {
            buffer.data[i] = positionList[i];
        });
        buffer.update();
    }

    upDateMesh(points: xyuv[], index: number[]) {
        const pList: number[] = [];
        const uvList: number[] = [];
        points.forEach((v) => {
            pList.push(v.x, v.y);
            uvList.push(v.u, v.v);
        })
        this.geometry = new Geometry({
            attributes: {
                aPosition: pList,
                aUV: uvList,
            },
            indexBuffer: index
        });
    }
}

export default TextureLayer