import StageLayer from "./LayerBase/StageLayer";
import Morpher from "./Morpher/Morpher";
import StageApp from "./StageApp";
import { xy } from "./TwoDType";

/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-17 19:34:52
 */
interface movementRecord {
    affectLayerId: string
    pointMoment: xy[]
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


        function setLayerFromPoints(points: xy[], layer: StageLayer | Morpher) {
            if (layer instanceof StageLayer) {
                layer.getPointList().forEach((v, i) => {
                    v.x += points[i].x;
                    v.y += points[i].y;
                })
                layer.upDatePoint();
            } else {
                const p = layer.points.map((v, i) => {
                    return {
                        x: v.x + points[i].x,
                        y: v.y + points[i].y
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


function unionMoveMent(move: xy[]) {
    return move.reduce((pre, cur) => {
        return {
            x: pre.x + cur.x,
            y: pre.y + cur.y
        }
    }, { x: 0, y: 0 })
}

function unionFromRecord(records: movementRecord[]) {
    const res = new Array<xy>(records[0].pointMoment.length);
    for (let index = 0; index < res.length; index++) {
        const move = records.map((v) => {
            return v.pointMoment[index];
        })
        res[index] = unionMoveMent(move);
    }
    return res;
}
export default AnimateRecordManager
export { unionFromRecord, unionMoveMent }
export type { movementRecord, rotationRecord }