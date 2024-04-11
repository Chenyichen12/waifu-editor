/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-09 11:12:54
 */
import { xy } from "../TwoDType.js";
import "./delaunay.js"

class Delaunay<T extends xy = xy> {
    getTriangleData(): { vertices: T[], triangles: number[][] };
    constructor(point: T[]);
}
export default Delaunay