import { Graphics } from "pixi.js";
import MeshPoint from "./GraphicsBase/MeshPoint";
import { instanceApp } from "./StageApp";

class SelectedRect extends Graphics {
    isShow = false;
    constructor() {
        super();
    }

    upDateSelected(pointList: MeshPoint[]) {
        if (pointList.length <= 1) {
            this.visible = false;
            return
        }
        this.visible = true;
        const xList = pointList.map((p) => {
            return p.x;
        });
        const yList = pointList.map((p) => {
            return p.y;
        });
        const left = Math.min(...xList);
        const right = Math.max(...xList);
        const top = Math.max(...yList);
        const button = Math.min(...yList);
        const padding = 10 / (instanceApp.value?.appScale.value ?? 1);
        this.rect(left - padding, top - padding, right - left + 2 * padding, top - button + 2 * padding)
            .stroke({
                color: 0xff0000,
                width: 2 / (instanceApp.value?.appScale.value ?? 1)
            })
    }
}
const selectedRect = new SelectedRect();
export default selectedRect;