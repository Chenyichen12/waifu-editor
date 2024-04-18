/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-03 19:15:43
 */
interface xy {
    x: number
    y: number
}

interface xyuv extends xy {
    u: number
    v: number
}

interface line<T extends xy = xy> {
    p1: T
    p2: T
}

interface pointTriangle<T extends xy = xy> {
    p1: T
    p2: T
    p3: T
}

interface rect<T extends xy = xy> {
    p1: T,
    p2: T,
    p3: T,
    p4: T
}
export type { xy, xyuv, line, rect, pointTriangle }
