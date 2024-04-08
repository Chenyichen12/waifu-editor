/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-04-08 18:23:03
 */
import RectInSelected from "../GraphicsBase/RectInSelected";
import { ContainesPoint } from "../LayerBase/util";
import { pointTriangle, xy } from "../TwoDType";

function Delaunay(meshList: xy[]) {
    const triangleList = new Set<pointTriangle<xy>>();
    const bound = getBound(meshList);
    triangleList.add(bound.t1);
    triangleList.add(bound.t2);

    for (const point of meshList) {
        const containTri = findPointInTri(point);
        if (containTri == undefined) return;

        const inCirTri = findPointInCircle(point, containTri);
        if (inCirTri == undefined) {
            triangleList.delete(containTri);
            addThreeTri(containTri.p1, containTri.p2, containTri.p3, point);
        } else {
            const neibor = getNeiborLine(containTri, inCirTri);
            const p1 = getPointExcept(neibor.p1, neibor.p2, containTri);
            const p3 = getPointExcept(neibor.p1, neibor.p2, inCirTri);
            triangleList.delete(containTri);
            triangleList.delete(inCirTri);

            addFourTri(p1, neibor.p1, p3, neibor.p2, point);
        }
    }

    const tempList = [...triangleList.values()];
    for (const tri of tempList) {
        if (containPoint(tri, bound.p1) || containPoint(tri, bound.p2)
            || containPoint(tri, bound.p3) || containPoint(tri, bound.p4)) {
            triangleList.delete(tri);
        }
    }

    return triangleList;

    function findPointInTri(point: xy) {
        for (const tri of triangleList) {
            if (ContainesPoint.contains(tri.p1, tri.p2, tri.p3, point)) {
                return tri;
            }
        }
        return undefined;
    }
    function findPointInCircle(point: xy, fil: pointTriangle<xy>) {
        for (const tri of triangleList) {
            if (fil !== tri && ifInCircle(tri, point)) {
                return tri;
            }
        }
        return undefined;
    }
    function addThreeTri(p1: xy, p2: xy, p3: xy, p: xy) {
        triangleList.add({
            p1: p1, p2: p2, p3: p
        })
        triangleList.add({
            p1: p2, p2: p3, p3: p
        })
        triangleList.add({
            p1: p1, p2: p3, p3: p
        })
    }

    function addFourTri(p1: xy, p2: xy, p3: xy, p4: xy, p: xy) {
        triangleList.add({
            p1: p1,
            p2: p2,
            p3: p
        })
        triangleList.add({
            p1: p2,
            p2: p3,
            p3: p
        })
        triangleList.add({
            p1: p3,
            p2: p4,
            p3: p
        })
        triangleList.add({
            p1: p4,
            p2: p1,
            p3: p
        })
    }

    function getPointExcept(p1: xy, p2: xy, tri: pointTriangle<xy>) {
        if (tri.p1 !== p1 && tri.p1 !== p2)
            return tri.p1;
        if (tri.p2 !== p1 && tri.p2 !== p2)
            return tri.p2;
        if (tri.p3 !== p1 && tri.p3 !== p2)
            return tri.p3;
        return tri.p1;
    }

    function containPoint(tri: pointTriangle<xy>, point: xy) {
        return tri.p1 === point || tri.p2 === point || tri.p3 === point
    }
}

function getBound(meshList: xy[]) {
    const rec = RectInSelected.getBound(meshList);
    const p1 = { x: rec.left, y: rec.top };
    const p2 = { x: rec.right, y: rec.top };
    const p3 = { x: rec.right, y: rec.button };
    const p4 = { x: rec.left, y: rec.button };
    const t1: pointTriangle<xy> = {
        p1, p2, p3
    }
    const t2: pointTriangle<xy> = {
        p1: p1,
        p2: p4,
        p3: p3
    }
    return { t1, t2, p1, p2, p3, p4 }
}

function getNeiborLine(tri1: pointTriangle<xy>, tri2: pointTriangle<xy>) {
    function containPoint(point: xy, tri: pointTriangle<xy>) {
        return point === tri.p1 || point === tri.p2 || point === tri.p3;
    }

    const select: xy[] = [];
    const triplist = [tri1.p1, tri1.p2, tri1.p3];
    for (const t of triplist) {
        if (containPoint(t, tri2)) {
            select.push(t);
        }
    }
    return {
        p1: select[0],
        p2: select[1],
    }
}
/**
 * | ax ay ax^2+ay^2 1 |
 * | bx by bx^2+by^2 1 |
 * | cx cy cx^2+cy^2 1 |
 * | px py px^2+py^2 1 |
 */
function ifInCircle(tri: pointTriangle<xy>, p: xy) {

    const p1 = tri.p1; const p2 = tri.p2; const p3 = tri.p3;
    const mat1 = [
        p2.x, p2.y, pointPow(p2),
        p3.x, p3.y, pointPow(p3),
        p.x, p.y, pointPow(p)
    ]

    const mat2 = [
        p1.x, p1.y, pointPow(p1),
        p3.x, p3.y, pointPow(p3),
        p.x, p.y, pointPow(p)
    ]

    const mat3 = [
        p1.x, p1.y, pointPow(p1),
        p2.x, p2.y, pointPow(p2),
        p.x, p.y, pointPow(p)
    ]

    const mat4 = [
        p1.x, p1.y, pointPow(p1),
        p2.x, p2.y, pointPow(p2),
        p3.x, p3.y, pointPow(p3),
    ]

    return -threeDeterminant(mat1) + threeDeterminant(mat2) - threeDeterminant(mat3) + threeDeterminant(mat4) > 0;
    function pointPow(point: xy) {
        return point.x * point.x + point.y * point.y;
    }
}

function threeDeterminant(set: number[]) {
    if (set.length != 9) return 0;
    return set[0] * set[4] * set[8] + set[1] * set[5] * set[6] + set[2] * set[3] * set[7]
        - set[6] * set[4] * set[2] - set[7] * set[5] * set[0] - set[3] * set[1] * set[8];
}

export default Delaunay;