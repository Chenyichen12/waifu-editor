/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-03-28 12:43:46
 */
import {rect} from "../TwoDType";
import MeshLine from "./MeshLine";

class MeshPoint {
    protected _x: number
    protected _y: number
    lines: MeshLine[] = []
    protected _u: number
    protected _v: number

    constructor(x: number, y: number, u: number, v: number) {
        this._x = x;
        this._y = y;
        this._u = u;
        this._v = v;
    }

    /**更改坐标，如果未指定参数用原先的坐标 */
    setPosition(x?: number, y?: number): void {
        this._x = x ?? this._x;
        this._y = y ?? this._y;
    }

    /**更改uv */
    setUV(u?: number, v?: number) {
        this._u = u ?? this._u;
        this._v = v ?? this._v;
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

    set x(x: number) {
        this._x = x;
    }

    set y(y: number) {
        this._y = y
    }

    containInRect(rec: rect) {
        return this.x <= rec.p2.x &&
            this.x >= rec.p1.x &&
            this.y <= rec.p3.y &&
            this.y >= rec.p1.y;
    }
}

export default MeshPoint;