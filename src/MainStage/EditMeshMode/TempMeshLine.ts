import MeshLine from "../GraphicsBase/MeshLine";
import MeshPoint from "../GraphicsBase/MeshPoint";

class TempMeshLine extends MeshLine {
    constructor(p1: MeshPoint, p2: MeshPoint) {
        super(p1, p2);
        p1.lines.pop();
        p2.lines.pop();
    }
}

export default TempMeshLine;