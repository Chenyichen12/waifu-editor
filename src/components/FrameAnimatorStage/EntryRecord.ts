import { v4 } from "uuid"
import StageLayer from "../../MainStage/LayerBase/StageLayer"
import Morpher from "../../MainStage/Morpher/Morpher"
import { xy } from "../../MainStage/TwoDType"

/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-17 08:57:48
 */

type stageLayer = StageLayer | Morpher
interface frameValue {
    Layer: stageLayer
    rotationMovement: number
    rotationMovement2?: number
    pointMovement: xy[]
    pointMovement2?: xy[]
}
enum frameNum {
    TWO, THREE, NONE
}

interface EntryConstructor {
    name: string,
    id: string
    currentValue: number
    frameNum: frameNum
}
class EntryRecord {
    protected entryName: string
    protected entryId: string
    protected currentValue: number = 0
    protected frameNum: frameNum = frameNum.NONE
    protected affectLayer: frameValue[] = []

    currentFrameAndValue(layer: stageLayer) {
        if (this.frameNum == frameNum.NONE) {
            return undefined
        }

        const index = this.affectLayer.find((v) => {
            return v.Layer === layer
        })
        if (index == undefined) {
            return undefined;
        }


        if (this.frameNum == frameNum.TWO) {
            return {
                currentFrame: this.currentValue,
                value: {
                    rotation: index.rotationMovement,
                    pointMovement: index.pointMovement
                }
            }
        }

        if (this.frameNum == frameNum.THREE) {
            return this.currentValue >= 0 ? {
                currentFrame: this.currentValue,
                value: {
                    rotation: index.rotationMovement2!,
                    pointMovement: index.pointMovement2!
                }
            } : {
                currentFrame: this.currentValue,
                value: {
                    rotation: index.rotationMovement,
                    pointMovement: index.pointMovement
                }
            }
        }
        return undefined
    }

    isLayerRegister(layer: stageLayer) {
        const find = this.affectLayer.find((v) => {
            return v.Layer === layer
        })
        if (find != undefined)
            return true;
        return false;
    }


    constructor(option: Partial<EntryConstructor>) {
        this.entryName = option.name ?? "未命名"
        this.entryId = option.id ?? v4();
        this.frameNum = option.frameNum ?? frameNum.NONE

    }

    get frameId() {
        return this.entryId
    }
}


export default EntryRecord