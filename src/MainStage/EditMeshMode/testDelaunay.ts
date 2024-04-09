/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-08 21:18:12
 */

import Delaunay from "./delaunay"

function test() {
    const testPoints = [
        { x: 8000, y: 2000 },
        { x: 1000, y: 3000 },
        { x: 20, y: 20 },
        { x: 10, y: 80 }
    ];
    const delaunay = new Delaunay(testPoints);
    console.log(delaunay.getTriangleData());
}
export default test;