import MeshLayer from "../GraphicsBase/MeshLayer";
import MeshLine from "../GraphicsBase/MeshLine";
import MeshPoint from "../GraphicsBase/MeshPoint";

/**
* 判断点是否在三角形内的函数
*/
type xy = { x: number, y: number }
type xyuv = xy & { u: number, v: number }
class vec {
    static dot(v1: xy, v2: xy) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    static sub(v1: xy, v2: xy) {
        return {
            x: v1.x - v2.x,
            y: v1.y - v2.y
        }
    }
}
class ContainesPoint {
    static contains(p1: xy, p2: xy, p3: xy, p: xy): boolean {
        const v0 = vec.sub(p2, p1);
        const v1 = vec.sub(p3, p1);
        const v2 = vec.sub(p, p1);

        const dot00 = vec.dot(v0, v0);
        const dot01 = vec.dot(v0, v1);
        const dot02 = vec.dot(v0, v2);
        const dot11 = vec.dot(v1, v1);
        const dot12 = vec.dot(v1, v2);

        const inverDeno = 1 / (dot00 * dot11 - dot00 * dot01);
        const u = (dot11 * dot02 - dot01 * dot12) * inverDeno;
        if (u < 0 || u > 1)
            return false;
        const v = (dot00 * dot12 - dot01 * dot02) * inverDeno;
        if (v < 0 || v > 1)
            return false;
        return u + v <= 1;
    }

    static uvCalculate(pa: xyuv, pb: xyuv, pc: xyuv, p: xy) {

        const ppb = vec.sub(p, pb);
        const pcb = vec.sub(pc, pb);
        const ppc = vec.sub(p, pc);
        const pac = vec.sub(pa, pc);
        const pab = vec.sub(pa, pb);
        const pbc = vec.sub(pb, pc);

        const alpha = (-ppb.x * pcb.y + ppb.y * pcb.x) / (-pab.x * pcb.y + pab.y * pcb.x);
        const beta = (-ppc.x * pac.y + ppc.y * pac.x) / (-pbc.x * pac.y + pbc.y * pac.x);
        const gama = 1 - alpha - beta;
        const u = alpha * pa.u + beta * pb.u + gama * pc.u;
        const v = alpha * pa.v + beta * pb.v + gama * pc.v;
        return {
            u, v
        }
    }
}
class tranigle {
    line1: MeshLine
    line2: MeshLine
    line3: MeshLine
    constructor(l1: MeshLine, l2: MeshLine, l3: MeshLine) {
        this.line1 = l1;
        this.line2 = l2;
        this.line3 = l3;
    }

    isEqual(tra: tranigle) {
        const isContain = (line: MeshLine) => {
            return line === this.line1
                || line === this.line2
                || line === this.line3
        }
        return isContain(tra.line1)
            && isContain(tra.line2)
            && isContain(tra.line3)
    }
}

class GenerateGlBuffer {
    static generate(pointList: MeshPoint[], lineList: MeshLine[]) {
        const tranigleList: tranigle[] = []
        const alreadyLine = new Set<MeshLine>();
        for (const line of lineList) {
            alreadyLine.add(line);
            const p1 = line.p1;
            const p2 = line.p2;
            /**
             * 三层循环，虽然采用了alreadyLine进行一定的优化
             * 我觉得主要需要优化枚举line3的地方
             * 或者用枚举点来解决
             * 对每个点的边进行枚举，相邻的两个边一定存在三角形，之后标注每条边建立三角形
             */
            const findAll = () => {
                for (const line2 of p1.lines) {
                    if (alreadyLine.has(line2))
                        continue;
                    const p3 = line2.anotherPoint(p1)!;
                    for (const line3 of p3.lines) {
                        if (line3.anotherPoint(p3) === p2) {
                            const newtri = new tranigle(line, line2, line3);
                            const tri = tranigleList.find((v) => {
                                return v.isEqual(newtri);
                            });
                            if (tri == null) {
                                tranigleList.push(newtri);
                            }
                            break;
                        }
                    }
                }
            }
            findAll();
        }

        const positionList: number[] = [];
        const uvList: number[] = [];
        const indexBuffer: number[] = [];
        pointList.forEach((item) => {
            positionList.push(item.x, item.y);
            uvList.push(item.u, item.v);
        })
        for (const tri of tranigleList) {
            const p1 = tri.line1.p1;
            const p2 = tri.line1.p2;
            let p3: MeshPoint
            if (tri.line2.p1 === p1 || tri.line2.p1 === p2) {
                p3 = tri.line2.p2;
            } else {
                p3 = tri.line2.p1;
            }

            const p1Index = pointList.findIndex((item) => item === p1)!;
            const p2Index = pointList.findIndex((item) => item === p2)!;
            const p3Index = pointList.findIndex((item) => item === p3)!;
            indexBuffer.push(p1Index, p2Index, p3Index);
        }

        return {
            positionList,
            uvList,
            indexBuffer
        }
    }
    static generateFromLayer(mesh: MeshLayer) {
        return this.generate(mesh.listPoint, mesh.listLine);
    }
}
export { ContainesPoint, GenerateGlBuffer }
