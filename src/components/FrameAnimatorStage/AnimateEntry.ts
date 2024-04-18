/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-17 16:30:17
 */

import { v4 } from "uuid";
import KeyFrameData from "./KeyFrame";
interface EntryOption {
    name: string,
    id: string,
    affectLayer: { id: string, data: KeyFrameData[] }[]
    around: aroundKey
}

enum aroundKey {
    zero2one,
    one2one
}
class AnimateEntry {
    readonly id: string;
    protected entryName: string

    currentValue: number = 0
    get name() { return this.entryName };

    readonly around: aroundKey

    //key是layer的id value存储当前layer的数据 -1，1，0等
    protected keyData: Map<string, KeyFrameData[]>

    constructor(option: Partial<EntryOption>) {
        this.id = option.id ?? v4();
        this.entryName = option.name ?? "未命名";
        this.keyData = new Map()
        this.around = option.around ?? aroundKey.zero2one
        if (option.affectLayer != undefined) {
            for (const layer of option.affectLayer) {
                this.keyData.set(layer.id, layer.data);
            }
        }
    }

    setKeyData(id: string, data: KeyFrameData) {
        if (!this.keyData.has(id))
            throw new Error("未注册")

        const datas = this.keyData.get(id)!;
        datas.forEach((v, i) => {
            if (v.currentValue == data.currentValue) {
                datas[i] = data;
            }
        })
    }
    get keyDatas() { return this.keyData }

    getData(id: string, key: number) {
        if (!this.keyData.get(id))
            return undefined

        const datas = this.keyData.get(id)!;
        for (const data of datas) {
            if (data.currentValue == key) {
                return data;
            }
        }
        return undefined
    }

    addKeyData(id: string, data: KeyFrameData[]) {
        this.keyData.set(id, data);
    }

    isRegister(id: string) {
        return this.keyData.has(id)
    }

    ifHitKey(layerId: string) {
        if (this.keyData.size == 0)
            return false;
        if (!this.keyData.has(layerId)) {
            throw new Error("未注册")
        }
        const data = this.keyData.get(layerId)!;
        const num = data.map((v) => {
            return v.currentValue;
        })
        if (num.includes(this.currentValue)) {
            return true;
        }
        return false;
    }

    nearestKey(layerId: string) {
        if (this.keyData.size == 0)
            throw new Error("未注册")
        if (!this.keyData.has(layerId)) {
            throw new Error("未注册")
        }


        const data = this.keyData.get(layerId)!;

        const num = data.map((v) => {
            return Math.abs(v.currentValue - this.currentValue);
        })

        const min = Math.min(...num);
        return data[num.indexOf(min)!].currentValue;
    }

    getCurrentValue(value: number, layerId: string) {
        if (!this.keyData.has(layerId)) {
            throw new Error("未注册")
        }

        const data = this.keyData.get(layerId)!.sort((a, f) => a.currentValue - f.currentValue);
        let current: KeyFrameData | undefined
        for (let index = 0; index < data.length - 1; index++) {
            const before = data[index].currentValue
            const after = data[index + 1].currentValue

            if (value >= before && value <= after) {
                const p1 = data[index].pointUvData;
                const p2 = data[index + 1].pointUvData;
                const deg = (value - before) / (after - before);
                const curPoint = p1.map((v, i) => {
                    return {
                        u: v.u + (p2[i].u - v.u) * deg,
                        v: v.v + (p2[i].v - v.v) * deg
                    }
                })
                let rotation: number | undefined = undefined
                if (data[index].rotationNum != undefined && data[index + 1].rotationNum != undefined) {
                    rotation = data[index].rotationNum! + (data[index + 1].rotationNum! - data[index].rotationNum!) * deg
                }
                current = new KeyFrameData(value, curPoint, rotation)
                break;
            }
        }
        return current;
    }

}

export default AnimateEntry