/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-17 16:30:17
 */

import { v4 } from "uuid"
import { xy } from "../../MainStage/TwoDType"

enum moveAround {
    zero2one,
    one2one
}
interface keyDataBase {
    type: string
}
interface pointBaseData extends keyDataBase {
    type: "points"
    movement: xy[]
}
interface rotationBaseData extends keyDataBase {
    type: "rotation"
    rotationPoint: xy
    rotationDegreeMoment: number
}

interface twoKeyPointBaseData extends pointBaseData {
    movement2: xy[]
}

interface twoKeyRotationBaseData extends rotationBaseData {
    rotationPoint2: xy
    rotationDegreeMoment: number
}

interface EntryOption {
    name: string,
    id: string,
    affectLayer: { id: string, type: keyDataBase }[]
}
abstract class AnimateEntry {
    readonly id: string
    protected _entryName: string
    protected affectLayer: Map<string, keyDataBase>
    get entryName() { return this._entryName };
    abstract ifHitKeyPoint(): boolean
    abstract getNearestKeyPoint(): number

    abstract addAffectLayer(layerId: string, layerDataType: keyDataBase): void;
    deleteAffectLayer(layerId: string): void {
        this.affectLayer.delete(layerId);
    }

    constructor(option: Partial<EntryOption>) {
        this.id = option.id ?? v4();
        this._entryName = option.name ?? "未命名"
        this.affectLayer = new Map();
        if (option.affectLayer != undefined) {
            for (const layer of option.affectLayer) {
                this.addAffectLayer(layer.id, layer.type);
            }
        }
    }


}