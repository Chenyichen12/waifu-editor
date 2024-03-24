import MeshLayer from "./MeshLayer";
import MeshLine from "./MeshLine";
class MeshPoint {
    protected _x: number
    protected _y: number
    parent: MeshLayer
    lines: MeshLine[] = []
    protected _u: number
    protected _v: number
    constructor(x: number, y: number, u: number, v: number, parent: MeshLayer) {
        this._x = x;
        this._y = y;
        this._u = u;
        this._v = v;
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

    get u() {
        return this._u;
    }
    get v() {
        return this._v;
    }
}
export default MeshPoint;