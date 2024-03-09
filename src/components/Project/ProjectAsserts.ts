import { v4 as uuid } from "uuid";

interface rect {
    width: number
    height: number
    top: number
    left: number
}

interface Assert{
    readonly assertId: string
    type: string
}

class ImageAssert implements Assert{
    pixMap: Uint8ClampedArray
    rec:rect
    readonly type = "image"
    readonly assertId: string
    constructor(pixMap: Uint8ClampedArray, rec: rect,id = uuid()) {
        this.pixMap = pixMap;
        this.rec = rec;
        this.assertId = id;
    }
}
export type {Assert,rect}
export {ImageAssert}