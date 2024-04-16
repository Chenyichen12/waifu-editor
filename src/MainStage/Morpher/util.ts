import { xy } from "../TwoDType";
import { vec } from "../LayerBase/util";
import cv from "@techstark/opencv-js";
import Morpher from "./Morpher";
import StageLayer from "../LayerBase/StageLayer";
import RectInSelected from "../GraphicsBase/RectInSelected";

//import getPerspectiveTransform from "./getPerspectiveTransform";
/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-11 13:02:32
 */

type uv = { u: number, v: number }


function quadUvCalculate(A: xy, B: xy, C: xy, D: xy, p: xy) {
    const H = vec.sub(p, A);
    const E = vec.sub(B, A);
    const F = vec.sub(D, A);
    const G = vec.sub(vec.add(vec.sub(A, B), C), D);

    const k0 = H.x * E.y - H.y * E.x;
    const k1 = E.x * F.y - E.y * F.x + H.x * G.y - H.y * G.x;
    const k2 = G.x * F.y - G.y * F.x
    const v = equation(k0, k1, k2);
    const u = (H.x - F.x * v) / (E.x + G.x * v);
    return {
        u, v
    }
}

function equation(k0: number, k1: number, k2: number) {
    if (k2 == 0) {
        return -k0 / k1;
    }
    const inner = k1 * k1 - 4 * k0 * k2;

    const v1 = (-k1 - Math.sqrt(inner)) / (2 * k2)
    if (v1 < 1 && v1 > 0) {
        return v1;
    }
    const v2 = (-k1 + Math.sqrt(inner)) / (2 * k2)
    if (v2 <= 1 && v2 >= 0) {
        return v2;
    } else {
        if (v1 == 0 || v1 == 1) {
            return v1;
        }
    }
    throw Error("equation out of uv")
}

function ifInQuad(A: xy, B: xy, C: xy, D: xy, p: xy) {

    const t1 = ifMin(A, B, D, p);
    const t2 = ifMin(B, C, A, p);
    const t3 = ifMin(C, D, B, p);
    const t4 = ifMin(D, A, C, p)
    return (t1 >= 0 && t2 >= 0 && t3 >= 0 && t4 >= 0)

    function ifMin(base: xy, b1: xy, b2: xy, test: xy) {
        return vec.cross(vec.sub(b1, base), vec.sub(test, base)) *
            vec.cross(vec.sub(test, base), vec.sub(b2, base));
    }
}

function quadPointCalculate(A: xy, B: xy, C: xy, D: xy, p: uv): xy {
    const x = A.x + p.u * (B.x - A.x) + (D.x - A.x) * p.v + (A.x - B.x + C.x - D.x) * p.u * p.v
    const y = A.y + p.u * (B.y - A.y) + (D.y - A.y) * p.v + (A.y - B.y + C.y - D.y) * p.u * p.v
    return { x, y }
}

function quadPerspectiveTransform(A: xy, B: xy, C: xy, D: xy, A1: xy, B1: xy, C1: xy, D1: xy, point: xy) {
    let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [A.x, A.y, B.x, B.y, C.x, C.y, D.x, D.y]);
    let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [A1.x, A1.y, B1.x, B1.y, C1.x, C1.y, D1.x, D1.y]);
    //转换的数据
    let M = cv.getPerspectiveTransform(srcTri, dstTri);
    let pointX = cv.matFromArray(1, 1, cv.CV_32FC2, [point.x, point.y]);
    let points_trans = new cv.Mat();
    cv.perspectiveTransform(pointX, points_trans, M);
    return {
        x: points_trans.data32F[0],
        y: points_trans.data32F[1]
    }

}

function triangleUVCalculate(A: xy, B: xy, C: xy, p: xy) {

    const ppb = vec.sub(p, B);
    const pcb = vec.sub(C, B);
    const ppc = vec.sub(p, C);
    const pac = vec.sub(A, C);
    const pab = vec.sub(A, B);
    const pbc = vec.sub(B, C);

    const alpha = (-ppb.x * pcb.y + ppb.y * pcb.x) / (-pab.x * pcb.y + pab.y * pcb.x);
    const beta = (-ppc.x * pac.y + ppc.y * pac.x) / (-pbc.x * pac.y + pbc.y * pac.x);
    const gama = 1 - alpha - beta;
    return {
        alpha, beta, gama
    }
}

function trianglePointCalculate(A: xy, B: xy, C: xy, alpha: number, beta: number, gama: number) {
    return {
        x: A.x * alpha + B.x * beta + C.x * gama,
        y: A.y * alpha + B.y * beta + C.y * gama
    }
}

function rotationPoint(origin: xy, degree: number, point: xy): xy {
    return {
        x: (origin.x - point.x) * Math.cos(degree) - (origin.y - point.y) * Math.sin(degree) + point.x,
        y: (origin.x - point.x) * Math.sin(degree) + (origin.y - point.y) * Math.cos(degree) + point.y
    }
}
function generateBound(childLayer: (StageLayer | Morpher)[]) {
    const farAway = 100000;
    let rectLeft = farAway;
    let rectTop = farAway;
    let rectRight = -farAway;
    let rectButton = -farAway;
    for (const layer of childLayer) {
        let ps: xy[];
        if (layer instanceof Morpher) {
            ps = layer.points;
        } else {
            ps = layer.mesh.listPoint;
        }
        const { top, left, button, right } = RectInSelected.getBound(ps);
        rectTop = rectTop > top ? top : rectTop;
        rectLeft = rectLeft > left ? left : rectLeft;
        rectRight = rectRight < right ? right : rectRight;
        rectButton = rectButton < button ? button : rectButton;
    }
    return { rectLeft, rectTop, rectRight, rectButton }
}
export { quadUvCalculate, ifInQuad, quadPointCalculate, quadPerspectiveTransform, trianglePointCalculate, triangleUVCalculate, rotationPoint, generateBound }