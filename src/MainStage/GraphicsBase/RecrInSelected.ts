import { instanceApp } from "../StageApp";
import MeshLayer from "./MeshLayer";
import MeshPoint from "./MeshPoint";

class RectInSelected {
    static upDate(points: MeshPoint[], canvas: MeshLayer) {
        const { left, top, right, button } = this.getBound(points);
        const padding = 10 / (instanceApp.value?.appScale.value ?? 1);
        canvas.rect(left - padding, top - padding, right - left + 2 * padding, top - button + 2 * padding)
            .stroke({
                color: 0xff0000,
                width: 2 / (instanceApp.value?.appScale.value ?? 1)
            })
    }

    private static getBound(points: MeshPoint[]) {
        const xList = points.map((p) => {
            return p.x;
        });
        const yList = points.map((p) => {
            return p.y;
        });
        const left = Math.min(...xList);
        const right = Math.max(...xList);
        const top = Math.max(...yList);
        const button = Math.min(...yList);
        return { left, top, right, button };
    }
}

export default RectInSelected