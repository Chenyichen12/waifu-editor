/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-08 21:18:12
 */
import MeshPoint from "../GraphicsBase/MeshPoint";
import Delaunay from "./Delaunay";

export default function test() {
    const p1 = new MeshPoint(10, 2, 0, 0);

    const p2 = new MeshPoint(0, 5, 10, 2);

    const p3 = new MeshPoint(9, 8, 0, 1);
    const p4 = new MeshPoint(5, 3, 1, 2);
    const ans = Delaunay([p1, p2, p3, p4]);
    console.log(ans);

}
