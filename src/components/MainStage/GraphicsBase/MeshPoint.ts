import MeshGraphics from "../MeshGraphics";
import MeshLine from "./MeshLine";
class MeshPoint {
    protected _x: number
    protected _y: number
    parent: MeshGraphics
    lines: MeshLine[] = []
    constructor(x: number, y: number, parent: MeshGraphics) {
        this._x = x;
        this._y = y;
        this.parent = parent;
    }
    setPosition(x?: number, y?: number): void {
        this._x = x ?? this._x;
        this._y = y ?? this._y;

    }

    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get xy() {
        return {
            x: this._x,
            y: this._y
        }
    }
}
export default MeshPoint;