/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-03-28 12:44:17
 */
import { Geometry, Mesh, Shader } from "pixi.js";
import { ImageAsset } from "../../components/Project/ProjectAssets";
import { GenerateGlBuffer } from "../LayerBase/util";
import MeshPoint from "../GraphicsBase/MeshPoint";
import MeshLine from "../GraphicsBase/MeshLine";
import vert from './layerShader.vert?raw'
import frag from './layerShader.frag?raw'
import { xy } from "../TwoDType";
/**
 * texture所需信息
 */
interface TextureLayerOption {
    texture: ImageAsset, //所需的图像信息
    /**用于构造mesh的几何信息 */
    points: MeshPoint[],
    lines: MeshLine[]
}
class TextureLayer extends Mesh<Geometry, Shader> {
    protected _textureId: string
    get textureId() { return this._textureId }

    constructor(option: TextureLayerOption) {
        const bufferInformation = GenerateGlBuffer.generate(option.points, option.lines);
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
        super({ geometry: geometry, shader: shader })

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
        const { buffer } = this.geometry.getAttribute("aPosition");
        buffer.data.forEach((_v, i) => {
            buffer.data[i] = positionList[i];
        });
        buffer.update();
    }

}

export default TextureLayer