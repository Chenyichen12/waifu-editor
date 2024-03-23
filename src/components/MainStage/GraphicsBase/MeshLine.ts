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
}
export default MeshLine