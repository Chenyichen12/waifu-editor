/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-03-28 12:42:02
 */
import { instanceApp } from "../StageApp";
import MeshLayer from "./MeshLayer";
import MeshPoint from "./MeshPoint";

/**
 * 当多选点的时候，出现一个包括点的矩形框，该矩形框用于管理多选的点，可以移动
 */
class RectInSelected {

    /**绘制多选框 */
    static upDate(points: MeshPoint[], canvas: MeshLayer) {
        const { left, top, right, button } = this.getBound(points);
        const padding = 10 / (instanceApp.value?.appScale.value ?? 1);
        canvas.rect(left - padding, top - padding, right - left + 2 * padding, top - button + 2 * padding)
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
    static getBound(points: MeshPoint[]) {
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
}

export default RectInSelected