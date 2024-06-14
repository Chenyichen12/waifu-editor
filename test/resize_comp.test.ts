import { test, expect } from 'vitest';
import ResizeManager, { ResizeComp } from '../src/resize_comp.ts';

class Comp implements ResizeComp {
  width: number;

  minWidth: number;

  constructor(width: number, minWidth:number) {
    this.width = width;
    this.minWidth = minWidth;
  }

  getWidth(): number {
    return this.width;
  }

  setWidth(width: number): void {
    this.width = width;
  }

  getMiniumWidth(): number {
    return this.minWidth;
  }
}

const ctxTest = test.extend<{compList: Comp[]}>({
  // eslint-disable-next-line no-unused-vars
  compList: async ({ task }, use) => {
    const compList = [new Comp(20, 10), new Comp(30, 10), new Comp(50, 20)];
    await use(compList);
    compList.length = 0;
  },
});
ctxTest('test_resizeTotal', ({ compList }) => {
  const totalWidth = compList.reduce((p, cur) => p + cur.width, 0);
  const manager = new ResizeManager(totalWidth, compList);

  manager.setTotalWidth(80);
  expect(compList[0].getWidth()).toBe(20);
  expect(compList[2].getWidth()).toBe(30);

  manager.setTotalWidth(60);
  expect(compList[1].getWidth()).toBe(20);
  expect(compList[2].getWidth()).toBe(20);

  manager.setTotalWidth(30);
  expect(compList[0].getWidth()).toBe(10);
  expect(compList[1].getWidth()).toBe(10);
  expect(compList[2].getWidth()).toBe(20);
});

ctxTest('test_resizeComp', ({ compList }) => {
  const totalWidth = compList.reduce((p, cur) => p + cur.width, 0);
  const manager = new ResizeManager(totalWidth, compList);
  const c1 = compList[0];
  const c2 = compList[1];
  const c3 = compList[2];

  manager.setCompWidth(c1, 10);
  expect(c2.width).toBe(40);
  manager.setCompWidth(c1, 5);
  expect(c2.width).toBe(40);

  manager.setCompWidth(c2, 50);
  expect(c3.width).toBe(40);

  manager.setCompWidth(c1, 60);
  expect(c3.width).toBe(30);
  expect(c2.width).toBe(10);
});
