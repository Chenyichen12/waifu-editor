/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-03-28 12:43:31
 */
import { rect } from '../TwoDType';
import MeshPoint from './MeshPoint'
class MeshLine {
    p1: MeshPoint
    p2: MeshPoint
    constructor(p1: MeshPoint, p2: MeshPoint) {
        this.p1 = p1;
        this.p2 = p2;

        p1.lines.push(this)
        p2.lines.push(this)

    }
    onRemove() {
        this.p1.lines = this.p1.lines.filter((item) => item !== this);
        this.p2.lines = this.p2.lines.filter((item) => item !== this);
    }
    /**
     * 已知一个point求另外一个point，若都不符合返回null
     * @param p 
     * @returns 
     */
    anotherPoint(p: MeshPoint): MeshPoint | null {
        if (p === this.p1)
            return this.p2;
        if (p === this.p2)
            return this.p1;
        return null
    }
    /**
     * 判断点是否命中这条线
     * @param x 点x坐标
     * @param y 点y坐标
     * @param hitDistance 判断的容错距离
     * @returns 是否命中
     */
    ifHitLine(x: number, y: number, hitDistance: number = 1): boolean {
        const top = this.p1.y > this.p2.y ? this.p2.y : this.p1.y;
        const button = this.p1.y > this.p2.y ? this.p1.y : this.p2.y;
        const left = this.p1.x > this.p2.x ? this.p2.x : this.p1.x;
        const right = this.p1.x > this.p2.x ? this.p1.x : this.p2.x;

        if (x > right + hitDistance || x < left - hitDistance || y > button + hitDistance || y < top - hitDistance)
            return false;
        return hitDistance * hitDistance >= MeshLine.distanceFromLine(x, y, this);
    }
    /**
     * 点距离线的平方距离
     * @param x 
     * @param y 
     * @param line 选定的线
     * @returns 返回平方距离
     */
    static distanceFromLine(x: number, y: number, line: MeshLine): number {
        const A = line.p1.y - line.p2.y;
        const B = line.p2.x - line.p1.x;
        const C = line.p1.x * line.p2.y - line.p2.x * line.p1.y
        const f = A * x + B * y + C;
        return (f * f) / (A * A + B * B);
    }
    containInRect(rec: rect) {
        return this.p1.containInRect(rec) && this.p2.containInRect(rec);
    }
}
export default MeshLine