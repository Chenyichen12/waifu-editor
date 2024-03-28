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
}
export default MeshLine