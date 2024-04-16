/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-11 14:23:12
 */
import { test, expect } from "vitest"
import { ifInQuad, quadPointCalculate, quadUvCalculate } from "../../MainStage/Morpher/util"
import { aN } from "vitest/dist/reporters-P7C2ytIv.js";
test("testQuad", () => {
    const A = { x: 0, y: -10 };
    const B = { x: 10, y: -20 };
    const C = { x: 10, y: 20 };
    const D = { x: 0, y: 10 };

    const p = { x: 5, y: 10 }

    const ans = quadUvCalculate(A, B, C, D, p);
    console.log(ans);

})
test("testQuad2", () => {
    const A = { x: 0, y: 0 };
    const B = { x: 100, y: 0 };
    const C = { x: 20, y: 20 };
    const D = { x: 0, y: 100 };

    const p = { x: 10, y: 2 }

    const ans = quadUvCalculate(A, B, C, D, p);
    B.x = 20;
    const ans2 = quadPointCalculate(A, B, C, D, ans);
    console.log(ans, ans2)

})


test("ifInQuad", () => {
    const A = { x: 0, y: 0 };
    const B = { x: 100, y: 0 };
    const C = { x: 20, y: 20 };
    const D = { x: 0, y: 20 };

    const p = { x: 19, y: 18 }

    const ans = ifInQuad(A, B, C, D, p);
    console.log(ans);
})