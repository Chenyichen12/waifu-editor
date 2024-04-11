import { xy } from "../TwoDType";

/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-11 13:02:32
 */
class vec {
    static add(p1: xy, p2: xy): xy {
        return {
            x: p1.x + p2.x,
            y: p1.y + p2.y
        }
    }

    static sub(p1: xy, p2: xy) {
        return {
            x: p1.x - p2.x,
            y: p1.y - p2.y
        }
    }
}

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

export { quadUvCalculate }