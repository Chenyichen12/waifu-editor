import MeshPoint from './MeshPoint'
class MeshLine {
    p1: MeshPoint
    p2: MeshPoint
    constructor(p1: MeshPoint, p2: MeshPoint) {
        this.p1 = p1;
        this.p2 = p2;
    }

}
export default MeshLine