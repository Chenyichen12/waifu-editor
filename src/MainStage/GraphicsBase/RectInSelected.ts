/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-03-28 12:42:02
 */
import { instanceApp } from "../StageApp";
import { xy } from "../TwoDType";
import MeshLayer from "./MeshLayer";
import MeshLine from "./MeshLine";
import MeshPoint from "./MeshPoint";

/**
 * 当多选点的时候，出现一个包括点的矩形框，该矩形框用于管理多选的点，可以移动
 */
class RectInSelected {

    /**绘制多选框 */
    static upDate(points: xy[], canvas: MeshLayer) {
        const { left, top, right, button } = this.getBound(points);
        const padding = 10 / (instanceApp.value?.appScale.value ?? 1);
        canvas.rect(left - padding, top - padding, right - left + 2 * padding, button - top + 2 * padding)
            .stroke({
                color: 0xff0000,
                width: 2 / (instanceApp.value?.appScale.value ?? 1)
            })
    }

    /**
     * 对于一系列点，找到最小包围住点的正矩形框
     * @param points 点集合
     * @returns 矩形四个角
     */
    static getBound(points: xy[]) {
        const xList = points.map((p) => {
            return p.x;
        });
        const yList = points.map((p) => {
            return p.y;
        });
        const left = Math.min(...xList);
        const right = Math.max(...xList);
        const top = Math.min(...yList);
        const button = Math.max(...yList);
        return { left, top, right, button };
    }

    static ifHitRect(points: xy[], hitPoint: xy) {
        if (points.length <= 1)
            return false;
        const rect = RectInSelected.getBound(points);
        const padding = 10 / (instanceApp.value?.appScale.value ?? 1);
        const p1 = new MeshPoint(rect.left - padding, rect.top - padding, 0, 0);
        const p2 = new MeshPoint(rect.right + padding, rect.top - padding, 0, 0);
        const p3 = new MeshPoint(rect.right + padding, rect.button + padding, 0, 0);
        const p4 = new MeshPoint(rect.left - padding, rect.button + padding, 0, 0);
        const l1 = new MeshLine(p1, p2);
        const l2 = new MeshLine(p2, p3);
        const l3 = new MeshLine(p3, p4);
        const l4 = new MeshLine(p4, p1);
        const lines = [l1, l2, l3, l4];

        for (const l of lines) {
            if (l.ifHitLine(hitPoint.x, hitPoint.y, 5 / (instanceApp.value?.appScale.value ?? 1))) {
                return true;
            }
        }
        return false;
    }
}

export default RectInSelected