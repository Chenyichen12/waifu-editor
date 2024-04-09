/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-08 08:08:39
 */
import MeshLayer, { MeshOption } from "../GraphicsBase/MeshLayer";
import MeshPoint from "../GraphicsBase/MeshPoint";
import RectInSelected from "../GraphicsBase/RectInSelected";

class EditMeshLayer extends MeshLayer {
    private lineIndex: number[][] = [];
    upDate(): void {
        this.clear()
        if (this.lineIndex == undefined)
            return
        for (const triIndex of this.lineIndex) {
            const p1 = this.pointList[triIndex[0]];
            const p2 = this.pointList[triIndex[1]];
            const p3 = this.pointList[triIndex[2]];
            this.moveTo(p1.x, p1.y)
                .lineTo(p2.x, p2.y)
                .stroke({
                    color: 0xc0c0c0,
                    width: 1 / this.appScale
                })
            this.moveTo(p2.x, p2.y)
                .lineTo(p3.x, p3.y)
                .stroke({
                    color: 0xc0c0c0,
                    width: 1 / this.appScale
                })
            this.moveTo(p1.x, p1.y)
                .lineTo(p3.x, p3.y)
                .stroke({
                    color: 0xc0c0c0,
                    width: 1 / this.appScale
                })
        }
        this.pointList.forEach((item) => {
            this.circle(item.x, item.y, 3 / this.appScale)
                .fill({
                    color: 0xff0000
                })
        })
        this.selectPointList.forEach((item) => {
            this.circle(item.x, item.y, 6 / this.appScale)
                .stroke({
                    color: 0xff0000,
                    width: 2 / this.appScale
                })
        })

        /**当有多个点的时候展示选中的Rect */
        if (this.selectPointList.size > 1) {
            RectInSelected.upDate([...this.selectPointList], this);
        }
    }
    setPoint(pList: MeshPoint[], index: number[][]) {
        this.pointList = pList;
        this.lineIndex = index;
        this.upDate();

    }
    constructor(option: MeshOption, lineIndex: number[][]) {
        super(option)
        this.lineIndex = lineIndex;
        this.upDate();
    }
}

export default EditMeshLayer