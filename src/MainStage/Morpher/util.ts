import { xy } from "../TwoDType";
import { vec } from "../LayerBase/util";
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
export { quadUvCalculate, ifInQuad, quadPointCalculate }