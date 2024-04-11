/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-11 14:23:12
 */
import { test, expect } from "vitest"
import { quadUvCalculate } from "../../MainStage/Morpher/util"
test("testQuad", () => {
    const A = { x: 0, y: -10 };
    const B = { x: 10, y: -20 };
    const C = { x: 10, y: 20 };
    const D = { x: 0, y: 10 };

    const p = { x: 5, y: 10 }

    const ans = quadUvCalculate(A, B, C, D, p);
    console.log(ans);

})