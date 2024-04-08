/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-08 08:08:39
 */
import MeshLayer from "../GraphicsBase/MeshLayer";
import MeshPoint from "../GraphicsBase/MeshPoint";
import RectInSelected from "../GraphicsBase/RectInSelected";

class EditMeshLayer extends MeshLayer {
    upDate(): void {
        this.clear()
        this.lineList.forEach((item) => {
            this.moveTo(item.p1.x, item.p1.y)
                .lineTo(item.p2.x, item.p2.y)
                .stroke({
                    color: 0xff0000,
                    width: 1 / this.appScale
                });
        })
        this.pointList.forEach((item) => {
            this.circle(item.x, item.y, 3 / this.appScale)
                .fill({
                    color: 0xff0000
                })
        })

        /**对于选中的目标进行更新 */
        this.selectLineList.forEach((item) => {
            this.moveTo(item.p1.x, item.p1.y)
                .lineTo(item.p2.x, item.p2.y)
                .stroke({
                    color: 0xc0c0c0,
                    width: 2 / this.appScale,
                    alpha: 0.5
                });
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

    delePoint(p: MeshPoint): boolean {
        if (this.pointList.length <= 3)
            return false;
        this.pointList = this.pointList.filter((v) => {
            return p !== v
        })
        return true;
    }
}