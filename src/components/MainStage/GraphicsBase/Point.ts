import MeshGraphics from "../MeshGraphics";
class MeshPoint {
    x: number
    y: number
    parent: MeshGraphics
    constructor(x: number, y: number, parent: MeshGraphics) {
        this.x = x;
        this.y = y;
        this.parent = parent;
    }

}