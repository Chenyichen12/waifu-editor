import Project from "../components/Project/Project";
import StageLayer from "./LayerBase/StageLayer";
import Morpher from "./Morpher/Morpher";
import StageApp from "./StageApp";

/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-17 19:34:52
 */

type uv = {
    u: number,
    v: number
}
interface movementRecord {
    affectLayerId: string
    /**如果parent是矩形变形器，uv表示矩形的uv，如果parent不是则表示是全局矩形的uv */
    pointMoment: uv[]
}

interface rotationRecord extends movementRecord {
    rotationMoveMent: number
}


class AnimateRecordManager {
    protected context: StageApp

    protected recordList: Map<string, movementRecord[]>
    constructor(context: StageApp) {
        this.context = context;
        this.recordList = new Map();
    }

    clearRecord() {
        this.recordList.clear();
    }

    addRecord(record: movementRecord) {
        if (this.recordList.has(record.affectLayerId)) {
            this.recordList.get(record.affectLayerId)!.push(record);
        } else {
            this.recordList.set(record.affectLayerId, [record]);
        }
    }

    addRecords(records: movementRecord[]) {
        for (const record of records) {
            this.addRecord(record);
        }
    }

    upDateRecord() {
        const setLayer = this.context.findLayerWithNoParent()
        for (const layer of setLayer) {
            const id = getIdFromLayer(layer);
            const records = this.recordList.get(id);
            if (records != undefined) {
                const points = unionFromRecord(records);
                setLayerFromPoints(points, layer);
            }
        }
        function setLayerFromPoints(points: uv[], layer: StageLayer | Morpher) {
            const bound = Project.instance.value!.root.bound

            if (layer instanceof StageLayer) {
                layer.getPointList().forEach((v, i) => {
                    v.x = points[i].u * bound.width
                    v.y = points[i].v * bound.height
                })
                layer.upDatePoint();
            } else {
                const p = layer.points.map((_v, i) => {
                    return {
                        x: points[i].u * bound.width,
                        y: points[i].v * bound.height
                    }
                })
                layer.setFromPointList(p, false);
            }
        }
    }

    getRecordFromeId(id: string) {
        return this.recordList.get(id);
    }
}

function getIdFromLayer(layer: StageLayer | Morpher) {
    if (layer instanceof StageLayer) {
        return layer.layerId;
    }
    return layer.morpherId;
}


function unionFromRecord(records: movementRecord[]) {
    const res = new Array<uv>(records[0].pointMoment.length);
    for (let index = 0; index < res.length; index++) {
        const totalU = records.reduce((pre, aft) => {
            return pre + aft.pointMoment[index].u
        }, 0)
        const totalV = records.reduce((pre, aft) => {
            return pre + aft.pointMoment[index].v;
        }, 0)
        res[index] = { u: totalU / records.length, v: totalV / records.length }
    }
    return res;
}
export default AnimateRecordManager
export { unionFromRecord }
export type { movementRecord, rotationRecord }